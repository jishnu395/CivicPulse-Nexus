import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Container,
    MenuItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { toast } from "react-toastify";

import { citizenAPI, permitAPI } from "../services/api";
import { getUser } from "../utils/auth";

export default function ApplyPermit() {

    const navigate = useNavigate();

    const [permitType,setPermitType]=useState("");

    const handleSubmit=async(e)=>{

        e.preventDefault();

        try{

            const user=getUser();

            const citizen=await citizenAPI.getByEmail(user.email);

            await permitAPI.apply({

                citizenId:citizen.data.id,
                permitType

            });

            toast.success("Permit Application Submitted");

            navigate("/my-permits");

        }catch(error){

            toast.error(
                error?.response?.data?.message ||
                "Failed"
            );

        }

    }

    return(

        <Container maxWidth="sm" sx={{mt:5}}>

            <Paper sx={{p:4}}>

                <Typography variant="h4">

                    Apply Permit

                </Typography>

                <form onSubmit={handleSubmit}>

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Permit Type"
                        value={permitType}
                        onChange={(e)=>setPermitType(e.target.value)}
                    >

                        <MenuItem value="TRADE_LICENSE">
                            Trade License
                        </MenuItem>

                        <MenuItem value="SHOP_LICENSE">
                            Shop License
                        </MenuItem>

                        <MenuItem value="BUILDING_PERMIT">
                            Building Permit
                        </MenuItem>

                        <MenuItem value="WATER_CONNECTION_PERMIT">
                            Water Connection Permit
                        </MenuItem>

                    </TextField>

                    <Button
                        fullWidth
                        sx={{mt:3}}
                        variant="contained"
                        type="submit"
                    >
                        Apply
                    </Button>

                </form>

            </Paper>

        </Container>

    );

}