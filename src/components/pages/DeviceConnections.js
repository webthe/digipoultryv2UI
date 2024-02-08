import React, { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import * as axiosInstance from '../utils/axiosinstace';

const DeviceConnections = () => {
    const [data, setData] = useState([]);
    const [lastMessage, setLastMessage] = useState(null); // For debugging: holds the last received message

    const columns = [
        {
          name: "Farmer",
          selector: "farmer",
          sortable: true
        },
        {
          name: "Farm Name",
          selector: "farmName",
          sortable: true,
          
        },
        {
          name: "Batch",
          selector: "batchName",
          sortable: true,
         
        },
        {
            name: "imeiNumber",
            selector: "imeiNumber",
            sortable: true,
            minWidth: '170px'
        },
        {
            name: "Added Date",
            selector: "createdDate",
            sortable: true
        },
        {
            name: "status",
            selector: "connectionStatus",
            sortable: true,
            width: '280px',
            cell: row => <div style={{
                ...statusStyle,
                backgroundColor: row.connectionStatus === 'Connected' ? '#00933b' :
                                row.connectionStatus === 'Connection Lost/Device is in off-state' ? '#a60505' : '#444'
            }}>{row.connectionStatus}</div>
        },
        {
            name: "Signal Strength",
            selector: "signalStrength",
            sortable: true,
            right: true,
        },
        // {
        //     name: "Last Updated",
        //     selector: "lastUpdated",
        //     sortable: true,
        //     right: true,
        // }
      ];
      const statusStyle = {
            padding: '5px',
            borderRadius: '15px',
            color: 'white',
        };

    const fetchDevices = useCallback(async () => {
        try {
            const response = await axiosInstance.getConnectionsList();
            
            setData(response.list.map(device => {
                const [connectionStatus, signalStrength] = device.connectionStatus.split(','); // Assuming status is the combined string
                return {
                    ...device,
                    connectionStatus, // separated status
                    signalStrength:`${signalStrength} dBm`, // separated signal strength
                    lastUpdated: device.lastUpdated || '', // Use existing or 'Not available'
                };
            }));
            setDisplayData(response.list.map(device => {
                const [connectionStatus, signalStrength] = device.connectionStatus.split(','); // Assuming status is the combined string
                return {
                    ...device,
                    connectionStatus, // separated status
                    signalStrength:`${signalStrength} dBm`, // separated signal strength
                    lastUpdated: device.lastUpdated || '', // Use existing or 'Not available'
                };
            }));
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        fetchDevices();
        //alert(JSON.stringify(data))
    }, [fetchDevices]);

    useEffect(() => {
        const ws = new WebSocket('wss://ipoultry.digiterrain.live/ws/');

        ws.onopen = () => {
            console.log('connected');
        };

        ws.onerror = (error) => {
            console.error("WebSocket error observed:", error);
        };

        ws.onmessage = evt => {
            try {
                // Parse the message
                const message = JSON.parse(evt.data);
                console.log("Received message:", message);

                // Update lastMessage state for debugging purposes
                setLastMessage(message);

                // Extract the deviceID and status
                const { deviceID, status, date } = message;
                const [connectionStatus, signalStrength] = status.split(',');

                // Update the state with the new status
                setData(prevData => {
                    const newData = prevData.map(device => {
                        if (device.imeiNumber === deviceID) {
                            return {
                                ...device,
                                connectionStatus,
                                signalStrength:`${signalStrength} dBm`,
                                lastUpdated: date, // Updating the last updated date
                            };
                        }
                        return device;
                    });
                    return newData;
                });

            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        ws.onclose = () => {
            console.log('disconnected');
        };

        // Clean up
        return () => {
            ws.close();
        };
    }, []);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayData, setDisplayData] = useState([]);

    useEffect(() => {
        if (searchTerm !== '' && searchTerm.length > 2) {
            const filteredData = data.filter(item => {
                const farmName = item.farmName || "";
                const batchName  = item.batchName || "";
                const signalStrength = item.signalStrength || "";
                const imei = item.imeiNumber || ""
                return farmName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                imei.includes(searchTerm) ||
                signalStrength.toLowerCase().includes(searchTerm.toLowerCase());
            });
            setDisplayData(filteredData);
        } else {
            setDisplayData(data);
        }
    }, [searchTerm, data]);
    return (
        <div className="devicesConnections">
            <div className="card">
                <div className="card-body">
                <div className="row">
                        <div className="col-md-4">
                            <form>
                                <div class="input-group">
                                    <input type="search" className="form-control form-control-sm" 
                                    placeholder="Search by Device ID/Barn/Batch/Signal Strength" 
                                    //value={searchTerm}
                                    onKeyUp={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div class="input-group-append">
                                        <div type="submit" className="btn btn-sm btn-default">
                                            <i class="fa fa-search"></i>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <br></br>
                        {/* <div className="col-md-8">
                            <ul class="controls">
                                <li><button onClick={()=>setShowAddPopup(true)}  type="button" class="btn btn-block btn-outline-success btn-sm">
                                    Add Device</button></li>
                                <li><button onClick={()=>deactivateDevice()} type="button" class="btn btn-block btn-outline-danger btn-sm">De-activate Device</button></li>
                            </ul>
                        </div> */}
                    </div>
                    <br></br>
                    <DataTable
                        key={Math.random()}
                        columns={columns}
                        data={displayData}
                        defaultSortField="Added Date"
                        pagination
                        dense
                        selectableRowsHighlight={true}
                        compact
                        highlightOnHover={true}
                        striped
                    />
                </div>
            </div>
        </div>
    );
}

export default DeviceConnections;
