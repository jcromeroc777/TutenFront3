import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Alert, AlertTitle } from '@material-ui/lab';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import API from './../api/api';

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    loading: {
      marginTop: '20em',
      marginLeft: '45em',
    },
    table: {
      minWidth: 700,
    },
    tableSpace: {
        marginTop: '40px',
    },
    fields: {
      margin: theme.spacing(3),
    },
    input: {
        marginTop: '0px'
    },
}));

export default function Dashboard(props) {
    const classes = useStyles();

    const [data, setData] = useState(null);
    const [dataCopy, setDataCopy] = useState(null);
    const [request, setRequest] = useState(true);
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const [filterValue, setFilterValue] = useState("");
    const [operator, setOperator] = useState("");
    const [value, setValue] = useState(0);

    useEffect(() => {

        if (request) {
            const headers = {
                'Accept': 'application/json',
                'adminemail': 'testapis@tuten.cl',
                'token': props.token,
                'app': 'APP_BCK'
            }

            API.get(`/TutenREST/rest/user/contacto%40tuten.cl/bookings?current=true&email=contacto@tuten.cl`, {
            headers: headers
            })
            .then((response) => {
                setData(response.data);
                setDataCopy(response.data);
                setLoading(false);
            }).catch((error) => {
                setError(true);
                setLoading(false);
                setTimeout(() => {
                    setRedirect(true);
                }, 3000);
            });
        }

        return () => {
            setRequest(false);
        }
    });

    const calculateDate = (timestamp) => {
        var date = new Date(timestamp);
        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    };

    const clean = () => {
        setFilterValue("");
        setOperator("");
        setValue(0);
        setData(dataCopy);
    };

    const filtering = () => {
        setData(dataCopy);
        let dataFilter = [];
        
        if(filterValue === "bookingId") {
            if(operator === "=="){
                // eslint-disable-next-line
                dataFilter = data.filter(booking => booking.bookingId == value);
            } else if (operator === ">=") {
                // eslint-disable-next-line
                dataFilter = data.filter(booking => booking.bookingId >= value);
            } else if (operator === "<=") {
                // eslint-disable-next-line
                dataFilter = data.filter(booking => booking.bookingId <= value);
            }
        } else if(filterValue === "bookingPrice") {
            if(operator === "=="){
                // eslint-disable-next-line
                dataFilter = data.filter(booking => booking.bookingPrice == value);
            } else if (operator === ">=") {
                // eslint-disable-next-line
                dataFilter = data.filter(booking => booking.bookingPrice >= value);
            } else if (operator === "<=") {
                // eslint-disable-next-line
                dataFilter = data.filter(booking => booking.bookingPrice <= value);
            }
        }
        setData(dataFilter);
    };

    if (redirect) {
        return <Redirect to={{ pathname: '/'}} />
    }

    return (
        <div>
            {
                loading ?
                    <CircularProgress className={classes.loading} color="secondary" size="3em"/> :
                error ?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Conexión expirada, vuelva a loguearse
                    </Alert> :
                    <div className={classes.root}>
                        <AppBar position="static">
                            <Toolbar>
                                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                <MenuIcon />
                                </IconButton>
                                <Typography variant="h6" className={classes.title}>
                                    Reservaciones
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Container fixed>
                            <Grid className={classes.fields} container spacing={1}>
                                <Grid item xs={2}>
                                    <InputLabel id="filter">Filtro</InputLabel>
                                    <Select
                                        labelId="filter"
                                        id="simple-filter"
                                        value={filterValue}
                                        onChange={(e) => {setFilterValue(e.target.value)}}
                                    >
                                        <MenuItem key={1} value={"bookingId"}>
                                            Id
                                        </MenuItem>
                                        <MenuItem key={2} value={"bookingPrice"}>
                                            Precio
                                        </MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={2}>
                                    <InputLabel id="operation">Operador</InputLabel>
                                    <Select
                                        labelId="operation"
                                        id="simple-operation"
                                        value={operator}
                                        onChange={(e) => {setOperator(e.target.value)}}
                                    >
                                        <MenuItem key={1} value={"=="}>
                                            &#61;
                                        </MenuItem>
                                        <MenuItem key={2} value={">="}>
                                            &#62;&#61;
                                        </MenuItem>
                                        <MenuItem key={3} value={"<="}>
                                            &#60;&#61;
                                        </MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        className={classes.input}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="value"
                                        label="Valor"
                                        name="value"
                                        autoFocus
                                        onChange={(e) => setValue(e.target.value)}
                                        size="small"
                                        type="number"
                                        value={value}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={filtering}
                                    >
                                        Filtrar
                                    </Button>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={clean}
                                    >
                                        Limpiar
                                    </Button>
                                </Grid>
                            </Grid>
                            <TableContainer component={Paper} className={classes.tableSpace}>
                                <Table className={classes.table} aria-label="customized table">
                                    <TableHead>
                                    <TableRow>
                                        <StyledTableCell>BookingId</StyledTableCell>
                                        <StyledTableCell>Cliente</StyledTableCell>
                                        <StyledTableCell>Fecha de Creación</StyledTableCell>
                                        <StyledTableCell>Dirección</StyledTableCell>
                                        <StyledTableCell>Precio</StyledTableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {data.map((row) => (
                                        <StyledTableRow key={row.bookingId}>
                                            <StyledTableCell component="th" scope="row">
                                                {row.bookingId}
                                            </StyledTableCell>
                                            <StyledTableCell>{`${row.tutenUserClient.firstName} ${row.tutenUserClient.lastName}`}</StyledTableCell>
                                            <StyledTableCell>{calculateDate(row.bookingTime)}</StyledTableCell>
                                            <StyledTableCell>{row.locationId.streetAddress}</StyledTableCell>
                                            <StyledTableCell>{row.bookingPrice}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Container>
                    </div>
            }
        </div>
    )
}
