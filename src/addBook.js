import React from "react";
import "./addBook.css";
import { useState, useEffect } from "react";
import _ from "lodash";
import { Controller, useForm, useController } from "react-hook-form";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; // Import z function from Zod
import axios from "axios"; //
import FormHelperText from "@mui/material/FormHelperText";
import { useNavigate } from "react-router-dom";
import DefaultIcon from "./Vector.png";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { Buffer } from "buffer";
import Autocomplete from "@mui/material/Autocomplete";

function AddNewBookPage({ open, onClose, edit, selectedRowData }) {
  const [isbns, setIsbns] = useState([]);
  const [num, setNum] = useState(0);
  const [isbnDetails, setIsbnDetails] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [debouncing, setDebouncing] = useState(false);
  const isbnList = async () => {
    return await axios.get(`http://localhost:5000/api/book/isbn`);
  };
  const defaultValues = selectedRowData || {};
  const mappedDefaultValues = {
    isbn: defaultValues.isbn || "", // Set a default value
    callNumber: defaultValues.call_number || "",
    title: defaultValues.title || "",
    author: defaultValues.author_name || "",
    country: defaultValues.country_name || "", // Assuming country_name comes from selectedRowData
    publisher: defaultValues.publisher_name || "", // Assuming publisher_name comes from selectedRowData
    edition: defaultValues.edition || "",
    pages: defaultValues.pages || "",
    price: defaultValues.price || "",
    publishedYear: defaultValues.publish_year || "",
    location: defaultValues.location || "",
    descriptions: defaultValues.description || "",
    status: defaultValues.status || "",
    fileName: defaultValues.image || "",
  };

  useEffect(() => {
    const fetchIsbns = async () => {
      const response = await isbnList();
      const isbnSet = new Set(response.data.map((book) => book.isbn)); // Create a Set with unique ISBNs
      setIsbns(Array.from(isbnSet)); // Convert the Set back to an array
    };

    fetchIsbns();
  }, []);
  const schema = z.object({
    isbn: z
      .string()
      .nonempty({ message: "ISBN is required" })
      .min(10, { message: "ISBN must be at least 10 characters" })
      .max(13, { message: "ISBN cannot exceed 13 characters" })
      .regex(/^\d{10,13}$/, {
        message: "ISBN must be a numeric value of 10 to 13 digits",
      }),
    callNumber: z.string().nonempty({ message: "Call Number is required" }),
    title: z.string().nonempty({ message: "Title is required" }),
    author: z.string().nonempty({ message: "Author is required" }),
    country: z.string().nonempty({ message: "Country is required" }),
    publisher: z.string().nonempty({ message: "Publisher is required" }),
    edition: z.coerce.number().gte(0, "Edition must be greater than 0"),
    pages: z.coerce.number().gte(0, "Page Number must be greater than 0"),
    price: z.coerce.number().gte(1, "Must be 1 and above"),
    publishedYear: z.coerce
      .number()
      .min(1, { message: "Invalid year" })
      .max(2024, { message: "Year cannot exceed 2024" }),
    // price: z
    //   .number({ message: "Price must be a number" })
    //   .min(0, { message: "Price cannot be negative" })
    //   .refine(
    //     (value) => {
    //       const regex = /^\d+(\.\d{1,2})?$/;
    //       return regex.test(value.toString());
    //     },
    //     {
    //       message:
    //         "Price must be a valid numeric value with up to 2 decimal places",
    //     }
    //   ),
    location: z.string().nonempty({ message: "Location is required" }),
    descriptions: z.string().nonempty({ message: "Description is required" }),
    status: z
      .string()
      .nonempty({ message: "Status is required" })

      .refine(
        (value) =>
          ["Available", "Borrowed", "Reserved", "Lost"].includes(value),
        {
          message: "Invalid status value",
        }
      ),
    fileName: z
      .string()
      .refine((value) => value.trim() !== "", { message: "File is required" }),
  });
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
    defaultValues: mappedDefaultValues,
  });
  const isbnController = useController({
    name: "isbn",
    control,
  });
  const fileNameController = useController({
    name: "fileName",
    control,
  });
  const titleController = useController({
    name: "title",
    control,
  });

  const authorController = useController({
    name: "author",
    control,
  });

  const editionController = useController({
    name: "edition",
    control,
  });

  const publisherController = useController({
    name: "publisher",
    control,
  });

  const publishedYearController = useController({
    name: "publishedYear",
    control,
  });

  const pagesController = useController({
    name: "pages",
    control,
  });

  const priceController = useController({
    name: "price",
    control,
  });

  const countryController = useController({
    name: "country",
    control,
  });

  const descriptionsController = useController({
    name: "descriptions",
    control,
  });
  const handleIsbnChange = _.debounce(async (event) => {
    const inputIsbn = event.target.value;
    setValue("isbn", inputIsbn);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/book/isbn/${inputIsbn}`
      );

      if (response.data) {
        setValue("isbn", response.data.isbn);
        // Set the fields that you want to autofill
        titleController.field.onChange(response.data.title);
        authorController.field.onChange(response.data.author_name);
        editionController.field.onChange(response.data.edition);
        publisherController.field.onChange(response.data.publisher_name);
        publishedYearController.field.onChange(response.data.publishedYear);
        pagesController.field.onChange(response.data.pages);
        priceController.field.onChange(response.data.price);
        countryController.field.onChange(response.data.country_name);
        descriptionsController.field.onChange(response.data.description);
        isbnController.field.onChange(response.data.isbn);
      }
    } catch (error) {
      console.error("Error fetching ISBN data:", error);
    } finally {
      // After the debounce period, reset readonly state
      setDebouncing(false);
    }
  }, 400);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const onSubmit = async (data) => {
    try {
      let response; // Declare response variable outside the if-else block

      if (edit) {
        data.edit = true;
        data.code = selectedRowData.book_code;
        response = await axios.post("http://localhost:5000/api/book", data);
        alert("wow");
        console.log(response);
        onClose();
        reset();
        alert("Book Updated successfully!");
      } else {
        try {
          data.edit = false;
          data.code = "whatever";
          response = await axios.post("http://localhost:5000/api/book", data);
          alert("wow");
          console.log(response);
          onClose();
          reset();
          alert("Book Added successfully!");
        } catch (e) {
          console.log("something wrong");
        }
      }
    } catch (error) {
      console.log(error);
      // Handle network errors or other unexpected errors
      setError("root", {
        message: "An error occurred while processing your request.",
      });
    }
  };
  const base64String = edit
    ? Buffer.from(mappedDefaultValues.fileName).toString("base64")
    : {};
  useEffect(() => {
    if (edit && base64String) {
      setSelectedImage(`data:image/png;base64,${base64String}`);
      setValue("fileName", base64String);
    }
  }, [selectedRowData]);

  // useEffect(() => {
  //   reset();
  // }, [onClose]);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

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
        fileNameController.field.onChange(imageBase64Stringsep);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    open && (
      <div className="modal-wrapper">
        <div className="modal-content">
          <div
            className={`close-wrapper ${isHovered ? "enlarge" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="close" onClick={onClose}>
              &times;
            </span>{" "}
          </div>
          <div>
            <h2>
              {!edit ? "Add New Book Information" : "Edit Book Information"}
            </h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="book-info">
              <div className="top-container">
                <div className="book-cover-section">
                  <div>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload File
                      <VisuallyHiddenInput
                        {...register("fileName")}
                        type="file"
                        id="file-upload"
                        aria-describedby="file-error"
                        onChange={handleImageChange}
                      />
                    </Button>
                  </div>
                  <div>
                    <FormHelperText
                      id="file-error"
                      style={{
                        color: "red",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {errors.fileName && errors.fileName.message}
                    </FormHelperText>
                  </div>
                  {selectedImage && (
                    <div className="cover">
                      <img
                        src={selectedImage}
                        alt="image"
                        className="selected-image"
                      />
                    </div>
                  )}

                  <div
                    className="book-status"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    {" "}
                    <FormControl
                      variant="standard"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        m: 1,
                        minWidth: 120,
                      }}
                    >
                      <InputLabel id="status-label">Status</InputLabel>
                      <Controller
                        name="status"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) =>
                            errors.status ? errors.status.message : true,
                        }} // Access error message directly
                        render={({ field }) => (
                          <Select
                            s
                            {...field}
                            labelId="status-label"
                            id="status"
                            label="Status"
                            error={!!errors.status}
                            helperText={errors.status && errors.status.message}
                          >
                            <MenuItem value="Available">Available</MenuItem>
                            <MenuItem value="Borrowed">Borrowed</MenuItem>
                            <MenuItem value="Reserved">Reserved</MenuItem>
                            <MenuItem value="Lost">Lost</MenuItem>
                          </Select>
                        )}
                      />{" "}
                      <FormHelperText
                        style={{
                          color: "red",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {errors.status && errors.status.message}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </div>
                <div className="short-input">
                  <div className="middle-container">
                    <div className="details-left">
                      {/* <div className="row-form">
                        <TextField
                          {...register("isbn")}
                          id="isbn"
                          onChange={handleIsbnChange}
                          // onChange={handleIsbnChange}
                          label="ISBN"
                          variant="outlined"
                          size="small"
                          error={!!errors.isbn}
                          helperText={errors.isbn?.message}
                        />
                      </div>{" "} */}
                      <Controller
                        name="isbn"
                        control={control}
                        defaultValue={defaultValues.isbn || ""} // Set default value for ISBN field
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            id="free-solo-demo"
                            freeSolo
                            onChange={(event, newValue) => {
                              if (newValue) {
                                handleIsbnChange({
                                  target: { value: newValue },
                                });
                              }
                            }}
                            options={isbns}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                id="isbn"
                                label="ISBN"
                                variant="outlined"
                                size="small"
                                error={!!errors.isbn}
                                helperText={errors.isbn?.message}
                                onBlur={handleIsbnChange} // Add this line
                              />
                            )}
                          />
                        )}
                      />
                      <div className="row-form">
                        <Controller
                          name="callNumber"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              id="callnumber"
                              label="Call Number"
                              variant="outlined"
                              size="small"
                              error={!!errors.callNumber}
                              helperText={errors.callNumber?.message}
                            />
                          )}
                        />
                      </div>
                      <div className="row-form">
                        <Controller
                          name="title"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              id="title"
                              label="Title"
                              variant="outlined"
                              size="small"
                              error={!!errors.title}
                              helperText={errors.title?.message}
                            />
                          )}
                        />
                      </div>
                      <div className="row-form">
                        <Controller
                          name="author"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              id="author"
                              label="Author"
                              variant="outlined"
                              size="small"
                              error={!!errors.author}
                              helperText={errors.author?.message}
                            />
                          )}
                        />
                      </div>
                      <div className="row-form">
                        <Controller
                          name="edition"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              id="edition"
                              label="Edition"
                              variant="outlined"
                              size="small"
                              error={!!errors.edition}
                              helperText={errors.edition?.message}
                            />
                          )}
                        />
                      </div>
                      <div className="row-form">
                        <Controller
                          name="country"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              id="country"
                              label="country"
                              variant="outlined"
                              size="small"
                              error={!!errors.country}
                              helperText={errors.country?.message}
                            />
                          )}
                        />
                      </div>
                    </div>{" "}
                    <div className="details-right">
                      <div className="row-form">
                        <Controller
                          name="publisher"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              id="publisher"
                              label="Publisher"
                              variant="outlined"
                              size="small"
                              error={!!errors.publisher}
                              helperText={errors.publisher?.message}
                            />
                          )}
                        />
                      </div>
                      <div className="row-form">
                        <Controller
                          name="publishedYear"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              id="published_year"
                              label="Published Year"
                              variant="outlined"
                              size="small"
                              error={!!errors.publishedYear}
                              helperText={errors.publishedYear?.message}
                            />
                          )}
                        />
                      </div>
                      <div className="row-form">
                        <Controller
                          name="pages"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              id="pages"
                              label="Pages"
                              variant="outlined"
                              size="small"
                              error={!!errors.pages}
                              helperText={errors.pages?.message}
                            />
                          )}
                        />
                      </div>
                      <div className="row-form">
                        <Controller
                          name="price"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              id="price"
                              label="Price"
                              variant="outlined"
                              size="small"
                              error={!!errors.price}
                              helperText={errors.price?.message}
                            />
                          )}
                        />
                      </div>
                      <div className="row-form">
                        <Controller
                          name="location"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              id="location"
                              label="Location"
                              variant="outlined"
                              size="small"
                              error={!!errors.location}
                              helperText={errors.location?.message}
                            />
                          )}
                        />
                      </div>
                    </div>{" "}
                  </div>
                  <Controller
                    name="descriptions"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="descriptions"
                        label="Descriptions"
                        variant="outlined"
                        size="small"
                        fullWidths
                        multiline
                        rows={2}
                        error={!!errors.descriptions}
                        helperText={
                          errors.descriptions && errors.descriptions.message
                        }
                      />
                    )}
                  />
                </div>{" "}
              </div>{" "}
              <div className="bottom-container">
                <button className={"addBtn"}>{!edit ? "Add" : "Edit"}</button>
              </div>
              {/*<div className="comments">*/}
              {/*    <!--comments sections-->*/}
              {/*</div>*/}
            </div>
          </form>
        </div>
      </div>
    )
  );
}

export default AddNewBookPage;
