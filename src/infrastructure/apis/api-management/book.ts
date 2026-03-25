import { useAppSelector } from "@application/store";
import {Configuration, BookControllerApi, BookDto} from "../client";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {isEmpty} from "lodash";

const getBooksQueryKey = "getBooksQuery";
const getBookQueryKey = "getBookQuery";
const addBookMutationKey = "addBookMutation";

const getFactory = (token: string | null) => new BookControllerApi(new Configuration({accessToken: token ?? ""}));

export const useGetBooks = (pageNo: number, pageSize: number) => {
    const {token} = useAppSelector(x => x.profileReducer); // You can use the data form the Redux storage.

    const result = useQuery({
        queryKey: [getBooksQueryKey, token, pageNo, pageSize],
        queryFn: async () => {
            return await getFactory(token).getAllBooks({pageNo, pageSize});
        },
        refetchInterval: Infinity, // Book information may not be frequently updated so refetching the data periodically is not necessary.
        refetchOnWindowFocus: false // This disables fetching the book information from the backend when focusing on the current window.
    });

    return {
        ...result,
        queryKey: getBooksQueryKey
    };
}

export const useGetBook = (author: string | null) => {
    const { token } = useAppSelector(x => x.profileReducer); // You can use the data form the Redux storage.

    return {
        ...useQuery({
            queryKey: [getBookQueryKey, token, author],
            queryFn: async () => await getFactory(token).getBooksByAuthor({author: author ?? ""}),
            refetchInterval: Infinity, // Book information may not be frequently updated so refetching the data periodically is not necessary.
            refetchOnWindowFocus: false, // This disables fetching the book information from the backend when focusing on the current window.
            enabled: !isEmpty(author)
        }),
        queryKey: getBookQueryKey
    };
}

export const useAddBook = () => {
    const { token } = useAppSelector(x => x.profileReducer); // You can use the data form the Redux storage.
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [addBookMutationKey, token],
        mutationFn: async (bookDto: BookDto) => {
            const result = await getFactory(token).addBook({ bookDto });
            await queryClient.invalidateQueries({queryKey: [getBooksQueryKey]});  // If the form submission succeeds then some other queries need to be refresh so invalidate them to do a refresh.
            await queryClient.invalidateQueries({queryKey: [getBookQueryKey]});

            return result;
        }
    })
}