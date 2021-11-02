import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const MyScorePage = () => {
    const [scores, setScores] = useState([]);
    const [name, setName] = useState("");
    useEffect(() => {
        const headers = {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*',
            'sessionid' : localStorage.getItem('sessionId')
        }

        axios
            .post('/user/myscore',null,{headers})
            .then((result) => {
                setScores(result.data.data);
                setName(result.data.name)
                console.log(result.data.data);
            })
            .catch((err) => console.error(err));
    }, []);


    const boards = scores.map((score,i) => Object.entries(score).map((entrie) => (
        <TableRow key={i} style={{ textAlign: 'center' }}>
            <TableCell style={{ textAlign: 'center' }}>{entrie[0]}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>{entrie[1]}</TableCell>
        </TableRow>
    )));

    return (
        <>
            <h2>{name}님의 점수</h2>
            <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow style={{ textAlign: "center" }}>
                                <TableCell style={{ textAlign: "center" }}>과목</TableCell>
                                <TableCell style={{ textAlign: "center" }}>점수</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {boards}
                        </TableBody>
                    </Table>
                </TableContainer>
        </>
    );
};

export default MyScorePage;
