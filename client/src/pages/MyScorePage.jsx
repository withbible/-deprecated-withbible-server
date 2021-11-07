import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const MyScorePage = () => {
    const [scores, setScores] = useState([]);
    const [name, setName] = useState("");
    const sessionId = localStorage.getItem("sessionId");
    useEffect(() => {
        axios
            .get('/user/myscore', { headers: { sessionid: sessionId } })
            .then((result) => {
                setScores(result.data.data);
                setName(result.data.name)
            })
            .catch((err) => console.error(err));
    }, []);


    const boards = scores.map((score,i) =>(
        <TableRow key={i} style={score.state === 'proceed' ? { textAlign: 'center', backgroundColor: '#64b5f6' } : {textAlign: 'center',  backgroundColor: '#fff176' }}  >
            <TableCell style={{ textAlign: 'center' }}>{score.subject}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>{score.score}</TableCell>
        </TableRow>
    ));

    return (
        <>
            <h2 style = {{marginTop:50, marginBottom:50}}>{name}님의 점수</h2>
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
