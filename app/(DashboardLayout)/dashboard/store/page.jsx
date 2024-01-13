import React from 'react'
import {StoreColumn} from "@/lib/table/table";
import {addStore, langs} from "@/lib/table/data";
import AddPerson from '../Addperson/page';
import CustomTable from '@/components/table/CustomTable';

const Store = () => {
  return (

      <div>
    <CustomTable   columns={StoreColumn}
                    langs={langs}
                    initial_dt={addStore}
                    perPage={10}
                    pagination={true}
                    paginationType="page"
                    defaultLang="Us"/>
    </div>
  )
}

export default Store
