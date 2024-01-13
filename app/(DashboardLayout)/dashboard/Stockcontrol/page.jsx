import {addStock, langs} from '@/lib/table/data'
import {StockColumn} from '@/lib/table/table'
import React from 'react'
import CustomTable from "@/components/table/CustomTable";

const Stockcontrol = () => {
    return (
        <div>
            <CustomTable
                columns={StockColumn}
                langs={langs}
                initial_dt={addStock}
                perPage={10}
                pagination={true}
                paginationType="page"
                defaultLang="Us"
            />
        </div>
    )
}

export default Stockcontrol
