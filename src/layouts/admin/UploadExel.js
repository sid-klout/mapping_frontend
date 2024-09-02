import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import swal from "sweetalert";
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import './uploadExcel.css';

const UploadExcel = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('Choose file');
  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 10;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(event.target.files[0].name);
    setFile(event.target.files[0]);
    if (!file) return;

    const reader = new FileReader();
    const fileType = file.type;

    reader.onload = (e) => {
      const binaryString = e.target.result;

      if (fileType.includes('csv') || file.name.endsWith('.csv')) {
        Papa.parse(binaryString, {
          header: true,
          complete: (results) => {
            console.log('CSV Parse Results:', results); // Debugging line
            setHeaders(results.meta.fields);
            setData(results.data);
          },
        });
      } else if (fileType.includes('spreadsheetml.sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const workbook = XLSX.read(binaryString, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        console.log('Excel Parse Results:', sheetData); // Debugging line

        setHeaders(sheetData[0]);
        setData(sheetData.slice(1).map(row => {
          const rowObject = {};
          row.forEach((cell, index) => {
            rowObject[sheetData[0][index]] = cell;
          });
          return rowObject;
        }));
      }
    };

    if (fileType.includes('csv') || file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else if (fileType.includes('spreadsheetml.sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.readAsBinaryString(file);
    }
  };

  const handleUploadICP = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', localStorage.getItem('userId'));
    try {
      const response = await axios.post('/user/uploadICP', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const result = response.data;
      if (result.status) {
        console.log(result);
        swal("Success", result.message, "success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const currentData = data.slice(currentPage * entriesPerPage, (currentPage + 1) * entriesPerPage);

  return (
    <>
      <div className="row p-3">
        <div className="card shadow mb-4">
          <div className="card-header d-flex justify-content-between py-3">
            <h4 className="m-0 font-weight-bold text-primary">EXCEL</h4>
            <div className="custom-file col-md-6 col-12">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                onChange={handleFileUpload}
                accept=".csv, .xlsx, .xls"
              />
              <label className="custom-file-label" htmlFor="customFile">
                {fileName}
              </label>
            </div>
          </div>
          <div className="card-body">
            {data.length > 0 && (
              <>
                <button className='btn btn-success px-4 mb-2 ms-auto d-flex' onClick={handleUploadICP}>Upload</button>
                <table className='table table-striped table-bordered'>
                  <thead>
                    <tr>
                      {headers.map((header, index) => (
                        <th key={index}>{header.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {headers.map((header, colIndex) => (
                          <td key={colIndex}>{row[header]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={Math.ceil(data.length / entriesPerPage)}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination justify-content-center"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadExcel;
