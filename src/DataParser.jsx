import  { useState } from "react";
import Papa from "papaparse";
import {  doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { v4 as uuid } from "uuid";

function DataParser() {



  // State to store parsed data
  const [ParsedData, setParsedData] = useState([]);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  //State to store the values
  const [values, setValues] = useState([]);

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse

    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values

        // eslint-disable-next-line array-callback-return
        results.data.map((d) => {
          // eslint-disable-next-line array-callback-return
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });
        // Parsed Data Response in array format
        setParsedData(results.data);

        // Filtered Column Names
        setTableRows(rowsArray[0]);

        // Filtered Values
        setValues(valuesArray);
      },
    });
  };

  const DataInserter = () => {
    ParsedData?.map(async (toolData) => {
        const uid = uuid();
      await setDoc(doc(db, "Tools", uid), {
        id: uid,
        Name: toolData.Name,
        Description: toolData.Description,
        Price: toolData.Price,
        VideoURL: "",
        URL: toolData.URL,
        Category: toolData.Category,
        LikedBy: [],
        Icon: toolData.Icon,
        Keywords: toolData.Keywords,
      });
      // console.log(toolData);
    });
  };

  return (
    <div>
      {/* File Uploader */}
      <input
        type="file"
        name="file"
        onChange={changeHandler}
        accept=".csv"
        className="block mt-10 p-2 w-full text-blue-700 bg-black rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      {tableRows?.length > 0 ? (
        <button className="bg-blue-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={() => DataInserter()}>
          Import
        </button>
      ) : null}
      <table className="mt-10 w-full">
      <thead className="bg-gray-200 dark:bg-gray-800 text-left">
        <tr className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-400 dark:border-gray-600">
          {tableRows.map((rows, index) => (
            <th className="p-2" key={index}>
              {rows}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-400 dark:divide-gray-600">
        {values.map((value, index) => (
          <tr
            className="hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-900 border-b border-gray-400 dark:border-gray-600"
            key={index}
          >
            {value.map((val, i) => (
              <td className="p-2 whitespace-pre-line" key={i}>
                {val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    
    </div>
  );
}

export default DataParser;
