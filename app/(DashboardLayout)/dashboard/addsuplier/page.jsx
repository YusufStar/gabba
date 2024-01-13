
import CustomTable from '@/components/table/CustomTable'
import { addSuplier, langs } from '@/lib/table/data'
import { suplierColumn } from '@/lib/table/table'
import React from 'react'

const Addsuplier = () => {
  return (
    <div>
          <CustomTable   columns={suplierColumn}
               langs={langs}
               initial_dt={addSuplier}
               perPage={10}
               pagination={true}
               paginationType="page"
               defaultLang="Us"/>

    </div>
  )
}

export default Addsuplier
