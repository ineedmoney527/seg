import React from "react";
import "./AddLibrarian.css";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import dayjs from "dayjs";
import { Hidden, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import DefaultIcon from "./Vector.png";
import { makeStyles } from "@mui/styles";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputAdornment from "@mui/material/InputAdornment";
import { createTheme } from "@mui/material/styles";
import { Buffer } from "buffer";
//icons
import AccountCircle from "@mui/icons-material/AccountCircle";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import EmailIcon from "@mui/icons-material/Email";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CakeIcon from "@mui/icons-material/Cake";

import AccessibleIcon from "@mui/icons-material/Accessible";

function AddLibrarian({ open, onClose, edit, selectedRowData }) {
  const [selectedImage, setSelectedImage] = useState(DefaultIcon);
  const defaultValues = selectedRowData || {}; // Set default values to selectedRowData if available

  const baseSchema = z.object({
    id: z
      .string()
      .length(8, { message: "8 digits are required for the ID" })
      .regex(/^\d+$/, {
        message: "ID must contain only digits",
      }),
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must include at least one lowercase letter",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must include at least one uppercase letter",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must include at least one special character",
      }),
    birthdate: z.coerce.date(),
    fileName: z.any(),
  });

  let schema;
  if (edit) {
    schema = baseSchema.omit({
      password: true,
    });
  } else {
    schema = baseSchema;
  }

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const [isHovered, setIsHovered] = useState(false);
  //for close button

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const base64String = edit
    ? Buffer.from(defaultValues.image_file).toString("base64")
    : {};
  const onSubmit = async (data) => {
    try {
      let response; // Declare response variable outside the if-else block

      if (edit) {
        response = await axios.put(
          `http://localhost:5000/api/user/${selectedRowData.id}`,
          data
        );
      } else {
        response = await axios.post("http://localhost:5000/api/user", data);
      }

      console.log(response);

      if (!response.data.success) {
        setError("email", { message: "Duplicate Email Entry." });
      } else {
        onClose();
        reset();
        alert("User added successfully!");
      }
    } catch (error) {
      console.log(error);
      // Handle network errors or other unexpected errors
      setError("root", {
        message: "An error occurred while processing your request.",
      });
    }
  };
  //const base64String = Buffer.from(

  useEffect(() => {
    if (edit && base64String) {
      setSelectedImage(`data:image/png;base64,${base64String}`);
      setValue("fileName", base64String);
    }
  }, [selectedRowData]);
  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (edit && defaultValues.image_file) {
      setValue(
        "fileName",
        Buffer.from(defaultValues.image_file).toString("base64")
      );
    }

    try {
      setSelectedImage(URL.createObjectURL(file));
    } catch (err) {}

    // Read the file as a base64 string
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");

        const imageBase64Stringsep = base64String;
        setValue("fileName", imageBase64Stringsep);
      };
      reader.readAsDataURL(file);
    }
  };
  // const reader = new FileReader();
  //   reader.onload = () => {
  //     setValue("fileName", reader.result.split(',')[1]); // Set the base64 string as the value
  //   };
  // };
  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  //   setValue("birthdate", date, { shouldValidate: true });
  // };
  const theme = createTheme({
    typography: {
      fontSize: 30,
      // Add other typography options as needed
    },
  });
  useEffect(() => {
    if (!edit) {
      reset();
      setValue("birthdate", null);
      setValue("fileName", defaultValues.image_file);
    }
  }, [edit, reset]);

  return (
    open && (
      <div className="modal-wrapper">
        <div>{defaultValues.birth_date}</div>
        <div className="modal-content">
          <div
            className={`close-wrapper ${isHovered ? "enlarge" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="close" onClick={onClose}>
              &times;
            </span>
          </div>
          <form className="myForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="vertical-stack">
              {selectedImage && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <h3>Profile Picture</h3>
                  <div>
                    <img
                      src={selectedImage}
                      alt={DefaultIcon}
                      className="selected-image"
                    />
                  </div>
                </div>
              )}
              {errors.fileName && (
                <div className="error">{errors.fileName.message}</div>
              )}
              <input
                style={{ textAlignLast: "center" }}
                {...register("image")}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <input
                type="hidden"
                defaultValue="./Vector.png"
                {...register("fileName")}
              />

              {errors.image && (
                <div className="error">{errors.image.message}</div>
              )}
              <Box
                sx={{ display: "flex", alignItems: "flex-end", gap: "10px" }}
              >
                <FingerprintIcon
                  sx={{ color: "action.active", mr: 1, my: 0.5 }}
                />
                <TextField
                  inputProps={{ style: { fontSize: 20 } }}
                  InputLabelProps={{ style: { fontSize: 25 } }}
                  className="textField"
                  {...register("id")}
                  autoComplete="off"
                  id="my-input"
                  outline="none"
                  label="ID"
                  variant="standard"
                  error={!!errors.id}

                  // defaultValue={defaultValues.name || ""}
                />
              </Box>
              {errors.id && <div className="error">{errors.id.message}</div>}

              <Box
                sx={{ display: "flex", alignItems: "flex-end", gap: "10px" }}
              >
                <AccountCircle
                  sx={{ color: "action.active", mr: 1, my: 0.5 }}
                />
                <TextField
                  inputProps={{ style: { fontSize: 20 } }}
                  InputLabelProps={{ style: { fontSize: 25 } }}
                  className="textField"
                  {...register("name")}
                  autoComplete="off"
                  id="my-input"
                  outline="none"
                  label="Name"
                  variant="standard"
                  error={!!errors.name}

                  // defaultValue={defaultValues.name || ""}
                />
              </Box>
              {errors.name && (
                <div className="error">{errors.name.message}</div>
              )}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",

                  gap: "10px",
                }}
              >
                <EmailIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  autoComplete="off"
                  InputLabelProps={{
                    style: { fontSize: 25 },
                  }}
                  inputProps={{ style: { fontSize: 20 } }}
                  className="textField" // font size of input tex
                  {...register("email")}
                  label="Email"
                  variant="standard"
                  error={!!errors.email}
                  // defaultValue={defaultValues.email || ""}
                />
              </Box>

              {errors.email && (
                <div className="error">{errors.email.message}</div>
              )}

              <Box
                sx={{ display: "flex", alignItems: "flex-end", gap: "10px" }}
              >
                <VpnKeyIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  InputLabelProps={{ style: { fontSize: 25 } }}
                  inputProps={{ style: { fontSize: 20 } }}
                  className="textField"
                  {...register("password")}
                  type="password"
                  label={!edit ? "Password" : "Not editable"}
                  autoComplete="off"
                  variant="standard"
                  disabled={edit ? true : false}
                  error={!!errors.password}
                />
              </Box>
              {errors.password && (
                <div className="error">{errors.password.message}</div>
              )}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  mt: "8px",
                  gap: "10px",
                }}
              >
                <CakeIcon sx={{ color: "action.active", mr: 1, my: 2 }} />
                <Controller
                  id="day"
                  name="birthdate"
                  control={control}
                  defaultValue={"" || dayjs(defaultValues.birth_date)} // Set the default value here
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        {...field}
                        format="YYYY-MM-DD"
                        variant="standard"
                        onChange={(newValue) => field.onChange(newValue)}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Box>
              {errors.birthdate && (
                <div className="error">{errors.birthdate.message}</div>
              )}

              <div
                className="button-container"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  className="submit"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Loading..." : "Submit"}
                </button>
              </div>
              {errors.root && (
                <div className="error">{errors.root.message}</div>
              )}
            </div>
          </form>
        </div>
      </div>
    )
  );
}

export default AddLibrarian;
