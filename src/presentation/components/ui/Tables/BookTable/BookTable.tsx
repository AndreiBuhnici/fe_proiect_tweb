import { useIntl } from "react-intl";
import { isUndefined } from "lodash";
import { TablePagination } from "@mui/material";
import { DataLoadingContainer } from "../../LoadingDisplay";
import { useBookTableController } from "./BookTable.controller";
import { BookDto } from "@infrastructure/apis/client";
import { BookAddDialog } from "../../Dialogs/BookAddDialog";
import {DataTable} from "@presentation/components/ui/Tables/DataTable";

/**
 * This hook returns a header for the table with translated columns.
 */
const useHeader = (): { key: keyof BookDto, name: string, order: number }[] => {
    const { formatMessage } = useIntl();

    return [
        { key: "title", name: formatMessage({ id: "globals.title" }), order: 1 },
        { key: "author", name: formatMessage({ id: "globals.name" }), order: 2 }
    ]
};


/**
 * Creates the user table.
 */
export const BookTable = () => {
    const { formatMessage } = useIntl();
    const header = useHeader();
    const { handleChangePage, handleChangePageSize, pagedData, isError, isLoading, tryReload, labelDisplay } = useBookTableController(); // Use the controller hook.

    return <DataLoadingContainer isError={isError} isLoading={isLoading} tryReload={tryReload}> {/* Wrap the table into the loading container because data will be fetched from the backend and is not immediately available.*/}
        <BookAddDialog /> {/* Add the button to open the user add modal. */}
        { !isUndefined(pagedData) && !isUndefined(pagedData?.totalElements) && !isUndefined(pagedData?.content) && !isUndefined(pagedData?.size) &&
            <TablePagination // Use the table pagination to add the navigation between the table pages.
                component="div"
                count={pagedData.totalElements} // Set the entry count returned from the backend.
                page={pagedData.totalPages !== 0 ? pagedData.number ?? 0 : 0} // Set the current page you are on.
                onPageChange={handleChangePage} // Set the callback to change the current page.
                rowsPerPage={pagedData.size} // Set the current page size.
                onRowsPerPageChange={handleChangePageSize} // Set the callback to change the current page size. 
                labelRowsPerPage={formatMessage({ id: "labels.itemsPerPage" })}
                labelDisplayedRows={labelDisplay}
                showFirstButton
                showLastButton
            />}

        <DataTable data={pagedData?.content ?? []}
                   header={header}
        />
    </DataLoadingContainer >
}