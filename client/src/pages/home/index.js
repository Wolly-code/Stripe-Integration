import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import CustomButton from '../../components/button';
import axios from 'axios';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { BarChart } from "@mui/x-charts";

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'account_country',
    headerName: 'Country',
    width: 50,
    editable: false,
  },
  {
    field: 'customer_email',
    headerName: 'Email',
    width: 180,
    editable: false,
  },
  {
    field: 'billing_reason',
    headerName: 'Billing Reason',
    type: 'number',
    width: 200,
    editable: false,
  },
  {
    field: 'starting_balance',
    headerName: 'Starting Balance',
    width: 150,
    editable: false,
  },
  {
    field: 'customer_address',
    headerName: 'Customer Address',
    width: 200,
    editable: false,
  },
  {
    field: 'invoice_pdf',
    headerName: 'Invoice Url',
    width: 200,
    // valueGetter: (params) =>
    //   <a href="${params.invoice_pdf}">${params.invoice_pdf}</a>,
    editable: true,

  },
];


const HomePage = () => {
  const [newTransactionID, setnewTransactionID] = useState();
  const [invoiceList, setinvoiceList] = useState([]);

  useEffect(() => {
    axios.get("/api/getInvoice").then((response) => {
      setinvoiceList(response.data.data);
    });
  }, []);

  function countryCounter(country) {
    let count = 0; // Initialize a variable to store the count
    for (let i = 0; i < invoiceList.length; i++) { // Loop through the array
      if (invoiceList[i].account_country === country) { // Check if the account_country is US
        count++; // Increment the count
      }
    }
    return count;
  }


  const newTransaction = async () => {
    try {
      const response = await fetch('/api/new-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "amount": "2000",
          "currency": "usd",
          "description": "This is a test payment",
          "paymentMethod": "pm_card_visa"
        })
      });


      const transaction = await response.json();
      setnewTransactionID(transaction.id)
      if (response.status === 200) {
        toast.success('Transaction Success')
      } else {
        toast.error('Transaction Failed')
      }
      console.log('Payment intent details:', transaction);


    } catch (err) {
      console.error(err)
      toast.error("Error in transaction")
    }
  };

  const RefundTransaction = async () => {
    console.log("RefundTransaction")

    try {
      const response = await fetch(`/api/refund/${newTransactionID}`, {
        method: 'POST',
      });

      const refund = await response.json();

      if (response.status === 200) {
        toast.success('Refund Success')
      } else {
        toast.error('Refund Failed')
      }
      console.log(refund);
    } catch (error) {
      console.error("Error Occured while Refunding")
      toast.error("Error while Refunding")
    }
  }
  const CreateSubscription = async () => {

    try {
      const response = await fetch(`/api/create-subscription`, {
        method: 'POST',
      });
      const subscription = await response.json()
      toast.success("Subscription Created")
      console.log(subscription)
    } catch (error) {
      console.log("Error occured while subscribing")
      toast.error("Error while subscribing")
    }
  }

  return (
    <div>
      <Navbar />
      <div className='flex flex-col items-center justify-center '>
        <CustomButton fun={newTransaction} text="Submit a new transaction" />
        <CustomButton fun={RefundTransaction} text="Refund a transaction" />
        <CustomButton fun={CreateSubscription} text="Create a new Subscription" />

        {/* <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={newTransaction}>Submit a new transaction</button> */}
        {/* <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={RefundTransaction}> </button> */}
        {/* <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={CreateSubscription}></button> */}

      </div>
      <DataGrid
        rows={invoiceList}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
      <h1>Transaction by Country</h1>
      <BarChart
        xAxis={[
          {
            id: 'Country',
            data: ['US', 'NP', 'JP'],
            scaleType: 'band',
          },
        ]}
        series={[
          {
            data: [countryCounter("US"), countryCounter("NP"), countryCounter("JP")],
          },
        ]}
        width={500}
        height={300}
      />

    </div>

  )
}

export default HomePage