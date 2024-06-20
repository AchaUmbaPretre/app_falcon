import React, { useEffect, useState, useCallback } from 'react';
import { Button,Table, Tag,Skeleton } from 'antd';
import { UserOutlined, DollarOutlined, CalendarOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const DepenseDetail = ({ date }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [depenses, setDepenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scroll = { x: 400 };

  const fetchDepenses = useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/depense`, { params: { date } });
      setDepenses(data);
    } catch (error) {
      console.error('Error fetching depenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [DOMAIN, date]);

  useEffect(() => {
    fetchDepenses();
  }, [fetchDepenses]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des dépenses", 14, 22);
    const tableColumn = ["#", "Jour", "Date", "Dollars", "Franc", "Total Dépense"];
    const tableRows = depenses.map((record, index) => [
      index + 1,
      record.jour,
      moment(record.date_depense).format('DD/MM/YYYY'),
      record.montant_dollars,
      record.montant_franc,
      record.montant_total_combine,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save('dépenses.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(depenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dépenses");
    XLSX.writeFile(wb, "depenses.xlsx");
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Jour',
      dataIndex: 'jour',
      key: 'jour',
      render: (text) => (
        <Tag color="orange" icon={<CalendarOutlined />}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date_depense',
      key: 'date_depense',
      sorter: (a, b) => moment(a.date_depense) - moment(b.date_depense),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy')}
        </Tag>
      ),
    },
    {
        title: 'Nom',
        dataIndex: 'username',
        key: 'username',
        render: (text, record) => (
          <div>
            <Tag color={'blue'}><UserOutlined style={{ marginRight: "5px" }} />{text}</Tag>
          </div>
        )
      },
    {
      title: 'Dollars',
      dataIndex: 'montant"',
      key: 'montant',
      sorter: (a, b) => a.montant - b.montant,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => (
        <Tag color={record.montant ? 'green' : 'red'} icon={<DollarOutlined />}>
          {record.montant ? `${record.montant} $` : '0 $'}
        </Tag>
      ), 
    },
    {
      title: 'Franc',
      dataIndex: 'montant_franc',
      key: 'montant_franc',
      sorter: (a, b) => a.montant_franc - b.montant_franc,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => (
        <Tag color={record.montant_franc ? 'green' : 'red'}>
          {record.montant_franc ? `${record.montant_franc} fc` : '0 fc'}
        </Tag>
      ),
    },
    {
      title: 'Total Dépense $',
      dataIndex: 'montant_total_combine',
      key: 'montant_total_combine',
      sorter: (a, b) => a.montant_total_combine - b.montant_total_combine,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => (
        <Tag color={record.montant_total_combine ? 'green' : 'red'} icon={<DollarOutlined />}>
          {record.montant_total_combine ? `${record.montant_total_combine} $` : '0 $'}
        </Tag>
      ),
    },
  ];

  return (
    <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_center">
          <div className="client_wrapper_center_bottom">
            <div className="product-bottom-top">
              <div className="product-bottom-left" />
              <div className="product-bottom-right">
                <Button onClick={exportToPDF} className="product-icon-pdf" icon={<FilePdfOutlined />} />
                <Button onClick={exportToExcel} className="product-icon-excel" icon={<FileExcelOutlined />} />
                <Button className="product-icon-printer" icon={<PrinterOutlined />} />
              </div>
            </div>
            {isLoading ? (
              <Skeleton active />
            ) : (
              <Table
                dataSource={depenses}
                columns={columns}
                loading={isLoading}
                scroll={scroll}
                className='table_client'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepenseDetail;
