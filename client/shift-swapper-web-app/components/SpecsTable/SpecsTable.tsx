'use client';
import {Table} from "@mantine/core";
import {formatCurrency} from "@/lib/utils/generalUtils";

type SpecsTableProps = {
    data : Auction;
};

export default function SpecsTable({data}: SpecsTableProps){
    return (
        <Table striped highlightOnHover withRowBorders>
            <Table.Tbody>
                <Table.Tr>
                    <Table.Th>Seller</Table.Th>
                    <Table.Td>{data.seller}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Make</Table.Th>
                    <Table.Td>{data.make}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Model</Table.Th>
                    <Table.Td>{data.model}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Year manufactured</Table.Th>
                    <Table.Td>{data.year}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Mileage</Table.Th>
                    <Table.Td>{data.mileage}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Reserve price</Table.Th>
                    <Table.Td>{formatCurrency(data.reservePrice)}</Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    );
}