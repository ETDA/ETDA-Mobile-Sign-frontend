import React, { useCallback } from "react";

import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Check from "@material-ui/icons/Check";
import * as Icon from "react-bootstrap-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import QrcodeDecoder from "qrcode-decoder";
import Countdown from "react-countdown";
import {
  Container,
  Paper,
  Button,
  CardContent,
  CardActions,
  Chip,
} from "@material-ui/core";

import {
  faFilePdf,
  faFileSignature,
  faFileCode,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons";

import StepConnector from "@material-ui/core/StepConnector";
import Typography from "@material-ui/core/Typography";
import { useDropzone } from "react-dropzone";
import "react-dropzone-uploader/dist/styles.css";
import "./demo.css";
import axios from "axios";
import swal from "sweetalert";
import Select from "react-select";
import MuiAlert from "@material-ui/lab/Alert";
import { render } from "@testing-library/react";

var rqid = "";
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

let closeCount = 0;
let filename = "0";
let timeCount = null;

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
  },
  active: {
    color: "#784af4",
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundColor: "#rgba(0, 0, 0, 0.87)",
    },
  },
  completed: {
    "& $line": {
      backgroundColor: "#3f51b5",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundColor: "#rgba(0, 0, 0, 0.87)",
  },
  completed: {
    backgroundColor: "#3f51b5",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <Icon.FileEarmarkText />,
    2: <FontAwesomeIcon icon={faListAlt} />,
    3: <FontAwesomeIcon icon={faFileSignature} />,
    4: <FontAwesomeIcon icon={faFileSignature} />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
  textAlignC: {
    textAlign: "center",
  },
  textAlignCdb: {
    textAlign: "right",
    display: "block",
  },

  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 800,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  test: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  },
  ColorRed: {
    color: "#ff0000",
    paddingTop: "15px",
    paddingBottom: "15px",
  },
  pdtb15: {
    paddingTop: "15px",
    paddingBottom: "15px",
  },
  title: {
    color: "#000000",
  },
  textAlignCenter: {
    textAlign: "center",
  },
  fixWidth: {
    minWidth: "600px",
  },
  textW: {
    color: "#ffffff",
  },
}));

function getSteps() {
  return ["อัปโหลด", "ลงลายมือชื่ออิเล็กทรอนิกส์"];
}

export function step1() {
  return "s";
}

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle
      disableTypography
      className={[classes.root, classes.textAlignCenter]}
      {...other}
    >
      <Typography variant="h6">{children}</Typography>
    </MuiDialogTitle>
  );
});

export default function CustomizedSteppers() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(1);
  // const [activeQr, setActiveQr] = React.useState(0);
  const [selectedValue, setSelectedValue] = React.useState("");
  const [openNext1, setOpenNext1] = React.useState(0);

  const [timeCount, setTimeCount] = React.useState(0);

  const [dataFile, setDataFile] = React.useState({
    _id: "",
    name: "",
    file: "",
    userId: "",
    ext: "",
    createdAt: "",
    qrcode: "",
    refNumber: "",
    requestId: "",
    requestToken: "",
    signedDocument: "",
  });
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  React.useEffect(() => {
    console.log("componentDidUpdateFunction");
  }, []);

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        console.log("Called", reader);
        baseURL = reader.result;
        console.log(baseURL);
        resolve(baseURL);
      };
      console.log(fileInfo);
    });
  };

  const handleNextStep1 = () => {
    let fileData = null;
    let base64 = "";
    let type = "PDF";
    let data_signing_request = {};
    let splitdata = [];
    var file_EXT = "";

    acceptedFiles.forEach((file) => {
      // console.log(file);
      file_EXT = file.type;
      if (file.type === "text/xml") {
        type = "XML";
      }
      fileData = file;
      // console.log(formData);
    });

    getBase64(fileData)
      .then((result) => {
        splitdata = result.split(",");
        console.log("splitdata", splitdata);
        console.log("splitdata0", splitdata[1]);

        base64 = splitdata[1];
        data_signing_request = {
          document_category: type,
          document: base64,
        };

        console.log(data_signing_request);
        console.log(JSON.stringify(data_signing_request));

        var config = {
          method: "post",
          url: process.env.REACT_APP_API_SIGNING_REQUEST,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            document_category: type,
            document: base64,
          }),
        };

        axios(config)
          .then(function (response) {
            // console.log(JSON.stringify(response.data));
            // console.log("response.data", response.data.data);

            if (response.data.status === "accept") {
              var qr = new QrcodeDecoder();

              qr.decodeFromImage(response.data.qrcode).then((res) => {
                console.log("data", res);
                console.log("qr", res.data);
                var dataSp = res.data.split(";");
                console.log("dataSp 1", dataSp[1]);
                console.log("dataSp 2", dataSp[2]);
                console.log("dataSp 3", dataSp[3]);
                rqid = dataSp[1];

                setDataFile({
                  ...dataFile,
                  qrcode: response.data.qrcode,
                  refNumber: dataSp[3],
                  requestId: dataSp[1],
                  requestToken: dataSp[2],
                  signedDocument: null,
                  ext: file_EXT,
                });
                handleClickOpen();
                closeCount = 0;
                setTimeCount(0);
                console.log("handleClickOpen");

                setTimeout(() => {
                  pollUntilDone(500, 60 * 1000)
                    .then(function (result) {
                      setActiveStep((prevActiveStep) => prevActiveStep + 1);

                      setDataFile({
                        ...dataFile,
                        signedDocument:
                          "data:" +
                          file_EXT +
                          ";base64," +
                          result.data.signed_document,
                        type: type,
                        ext: file_EXT,
                      });

                      handleClose();
                      console.log("pollUntilDone result", result);
                      // have final result here
                    })
                    .catch(function (err) {
                      console.log("err =", err);
                      if (err === "Error: connection") {
                        swal("API CONNECTION", "ติดต่อ API ไม่ได้", "warning");
                      } else {
                        swal({
                          title: "Reject",
                          text: "Timeout",
                          icon: "warning",
                          closeOnClickOutside: false,
                          closeOnEsc: false,
                          buttons: {
                            cancel: false,
                            catch: false,
                            OK: true,
                          },
                        }).then((willDelete) => {
                          if (willDelete) {
                            handleNextStep1();
                            setTimeCount(1);
                          } else {
                          }
                        });
                      }
                      // handle error here
                    });
                }, 2000);
              });
            } else {
              swal(response.data.status, response.data.description, "warning");
            }
          })
          .catch(function (error) {
            if (error.response) {
              /*
               * The request was made and the server responded with a
               * status code that falls out of the range of 2xx
               */
              console.log("error.reques.data", error.response.data);
              console.log("error.reques.status", error.response.status);
              console.log("error.reques.headers", error.response.headers);
            } else if (error.request) {
              /*
               * The request was made but no response was received, `error.request`
               * is an instance of XMLHttpRequest in the browser and an instance
               * of http.ClientRequest in Node.js
               */
              console.log("error.reques", error.request);
            } else {
              // Something happened in setting up the request and triggered an Error

              console.log("error.message", error.request);
            }
            console.log("error.config", error.config);

            swal("API CONNECTION", "ติดต่อ API ไม่ได้", "warning");
            // console.log(error);
          });

        // base64 = result.substr(result.indexOf(",") + 1);
        console.log("base64", result);
        console.log("File Is", fileData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleNextStep2 = () => {
    var config = {
      method: "post",
      url: process.env.REACT_APP_API_SIGNING_REQUEST,
    };
    axios(config)
      .then(function (response) {
        const dataFiles = {
          _id: response.data.data._id,
          name: response.data.data.name,
          file: response.data.data.file,
          userId: response.data.data.userId,
          ext: response.data.data.ext,
          createdAt: response.data.data.createdAt,
          qrcode: response.data.data.qrcode,
          refNumber: response.data.data.refNumber,
          requestId: response.data.data.requestId,
          requestToken: response.data.data.requestToken,
          signedDocument: response.data.data.signedDocument,
        };
        console.log("signing_request dataFiles", dataFiles);
        setDataFile({
          ...dataFiles,
        });
        handleClickOpen();
      })
      .catch(function (error) {
        if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          console.log("error.reques.data", error.response.data);
          console.log("error.reques.status", error.response.status);
          console.log("error.reques.headers", error.response.headers);
        } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          console.log("error.reques", error.request);
        } else {
          // Something happened in setting up the request and triggered an Error

          console.log("error.message", error.request);
        }
        console.log("error.config", error.config);
        swal("API CONNECTION", "ติดต่อ API ไม่ได้", "warning");
      });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function pollUntilDone(interval, timeout) {
    let start = Date.now();
    function run() {
      return handleNextStep3()
        .then(function (dataResult) {
          console.log("pollUntilDone", dataResult);
          if (dataResult.data.result === "accept") {
            // we know we're done here, return from here whatever you
            // want the final resolved value of the promise to be
            return dataResult;
          } else {
            if (closeCount === 1) {
              throw new Error("timeout error on pollUntilDone");
            } else {
              // run again with a short delay
              return delay(interval).then(run);
            }
          }
        })
        .catch(function (error) {
          if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            if (error.response.status === 500) {
              if (closeCount === 1) {
                throw new Error("timeout error on pollUntilDone");
              } else {
                // run again with a short delay
                return delay(interval).then(run);
              }
            }
            console.log("error.reques.data", error.response.data);
            console.log("error.reques.status", error.response.status);
            console.log("error.reques.headers", error.response.headers);
          } else if (error.request) {
            console.log("error.reques", error.request);
            throw new Error("connection");

            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
          } else {
            // Something happened in setting up the request and triggered an Error
            console.log("error.message", error.request);
            throw new Error("connection");
          }
        });
    }
    return run();
  }

  // interval is how often to poll
  // timeout is how long to poll waiting for a result (0 means try forever)
  // url is the URL to request

  const handleNextStep3 = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    console.log("handleNextStep3", dataFile);
    var config = {
      method: "post",
      url: process.env.REACT_APP_API_SIGNED_REQUEST,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        request_id: rqid,
      }),
    };
    return axios(config);
  };

  const handleReset = () => {
    window.location.reload();
  };
  const handleChange = (e) => {
    setSelectedValue(e.value);
  };

  const onDrop = useCallback((acceptedFiles, fileRejections, event) => {
    console.log("onDrop acceptedFiles", acceptedFiles);
    console.log("onDrop fileRejections", fileRejections);
    console.log("onDrop event", event);

    if (acceptedFiles.length > 0) {
      setOpenNext1(1);
    } else {
      swal({
        text: "กรุณาเลือก หรือ วางไฟล์ เอกสารประเภท XML หรือ PDF",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        setOpenNext1(0);
      });
    }

    if (fileRejections.length > 1) {
      swal({
        text: "กรุณาเลือก หรือ วางไฟล์ เอกสารประเภท XML หรือ PDF เพียง 1 ไฟล์",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        setOpenNext1(0);
      });
    }
    // Do something with the files
  }, []);

  const onDropRejected = (fileRejections, event) => {
    console.log("onDropRejected", acceptedFiles);
    console.log("onDropRejected", event);

    // Do something with the files
  };
  const onDropAccepted = (fileRejections, event) => {
    // console.log("onDropAccepted", fileRejections);
    // console.log("onDropAccepted", event);
    // Do something with the files
  };

  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    noKeyboard: true,
    accept: [".pdf", ".xml"],
    maxFiles: 1,
    onDrop,
    onDropRejected,
    onDropAccepted,
  });

  const files = acceptedFiles.map((file) => {
    let fname = file.name.split(".");
    filename = fname[0];
    return <li key={file.path}>{file.path}</li>;
  });
  const dropzoneRef = React.createRef();
  const openDialog = () => {
    // Note that the ref is set async,
    // so it might be null at some point
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state

      stopcountdown();
      return (
        <Typography component="span" variant="h6">
          <span>
            {hours}:{minutes}:{seconds}
          </span>
        </Typography>
      );
    } else {
      // Render a countdown
      return (
        <Typography component="span" variant="h6">
          <span>
            {hours}:{minutes}:{seconds}
          </span>
        </Typography>
      );
    }
  };

  const stopcountdown = () => {
    console.log("stopcountdown");
    closeCount = 1;
  };

  React.useEffect(() => {
    console.log("useEffect", dataFile);
  }, [dataFile]);

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <div className={classes.root}>
            <h2> ขั้นตอนการลงลายมือชื่ออิเล็กทรอนิกส์ </h2>
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<ColorlibConnector />}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <div>
              {activeStep === steps.length ? (
                <div>
                  <Paper className={classes.paper}>
                    <Typography component="span" variant="h6">
                      {" "}
                      ดาวน์โหลด Signed Document: ขั้นตอนที่ 2 - 2{}
                    </Typography>

                    <CardContent component={"div"}>
                      {dataFile.signedDocument ? (
                        <Typography
                          component="div"
                          className={classes.title}
                          color="textSecondary"
                          gutterBottom
                        >
                          <Alert
                            severity="success"
                            className={classes.textAlignC}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              <span className="fa-layers fa-fw">
                                {dataFile.ext === "application/pdf" ? (
                                  <FontAwesomeIcon icon={faFilePdf} />
                                ) : (
                                  <FontAwesomeIcon icon={faFileCode} />
                                )}
                              </span>
                              <span>
                                {" "}
                                <a
                                  target="_blank"
                                  rel="noreferrer"
                                  className={classes.textW}
                                  download={filename + "_signed"}
                                  href={dataFile.signedDocument}
                                >
                                  {" "}
                                  Signed Document{" "}
                                </a>
                              </span>
                            </div>
                          </Alert>
                        </Typography>
                      ) : null}
                    </CardContent>

                    {/* <hr /> */}
                  </Paper>
                  <CardActions className={classes.textAlignCdb}>
                    <Button
                      color="primary"
                      onClick={handleReset}
                      variant="contained"
                      className={classes.button}
                    >
                      อัปโหลดเอกสารอีกครั้ง
                    </Button>

                    {dataFile.qrcode === undefined ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNextStep2}
                        className={classes.button}
                      >
                        Signing Request
                      </Button>
                    ) : null}
                  </CardActions>
                </div>
              ) : (
                <div>
                  <Typography component="div" className={classes.instructions}>
                    {activeStep === 1 ? (
                      <Paper className={classes.paper}>
                        <Typography variant="h6">
                          ตัวอย่างแบบฟอร์มเพื่ออัปโหลดเอกสาร : ขั้นตอนที่ 1 - 2
                        </Typography>
                        <br />

                        <div className={classes.test}>
                          <Container
                            {...getRootProps({})}
                            className={classes.textAlignC}
                          >
                            <input {...getInputProps()} />
                            <Typography
                              component="div"
                              className={classes.ColorRed}
                            >
                              <Button
                                color="primary"
                                onClick={openDialog}
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                              >
                                Upload
                              </Button>
                            </Typography>
                            {isDragAccept && (
                              <Typography className={classes.ColorRed}>
                                All files will be accepted
                              </Typography>
                            )}
                            {isDragReject && (
                              <Typography className={classes.ColorRed}>
                                กรุณาเลือก หรือ วางไฟล์ เอกสารประเภท XML หรือ
                                PDF ที่นี่
                              </Typography>
                            )}

                            {!isDragActive && acceptedFiles.length === 0 && (
                              <Typography className={classes.ColorRed}>
                                กรุณาเลือก หรือ วางไฟล์ เอกสารประเภท XML หรือ
                                PDF ที่นี่
                              </Typography>
                            )}

                            {!isDragActive && acceptedFiles.length > 0 && (
                              <Typography
                                component={"div"}
                                className={classes.pdtb15}
                              >
                                <Alert severity="info">{files}</Alert>
                              </Typography>
                            )}
                          </Container>
                        </div>
                      </Paper>
                    ) : null}
                    {activeStep === 2 ? (
                      <div>
                        <Paper className={classes.paper}>
                          <Typography variant="h6">
                            {" "}
                            แสดงเอกสาร : ขั้นตอนที่ 2 - 2
                          </Typography>
                          <CardContent component={"div"}>
                            <Typography
                              className={classes.title}
                              gutterBottom
                              color="textSecondary"
                            >
                              <b>Document ID:</b>{" "}
                              <Chip
                                variant="outlined"
                                color="primary"
                                label={dataFile._id}
                              />
                            </Typography>
                            <br />
                            <Typography
                              className={classes.title}
                              color="textSecondary"
                              gutterBottom
                            >
                              <b>ชื่อเอกสาร: </b>
                              <Chip
                                variant="outlined"
                                color="primary"
                                label={dataFile.name}
                              />
                            </Typography>
                            <br />
                            <Typography
                              className={classes.title}
                              color="textSecondary"
                              gutterBottom
                            >
                              <b>Extension: </b>
                              <Chip
                                variant="outlined"
                                color="primary"
                                label={dataFile.ext}
                              />
                            </Typography>
                            <br />

                            <Typography
                              component="div"
                              className={classes.title}
                              color="textSecondary"
                              gutterBottom
                            >
                              <b>Original Document:</b>
                              <br />
                              <br />
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                <span className="fa-layers fa-fw">
                                  {dataFile.ext === "application/pdf" ? (
                                    <FontAwesomeIcon icon={faFilePdf} />
                                  ) : (
                                    <FontAwesomeIcon icon={faFileCode} />
                                  )}
                                </span>
                                <span>
                                  {" "}
                                  <a
                                    rel="noreferrer"
                                    target="_blank"
                                    href={dataFile.file}
                                  >
                                    {" "}
                                    Original Document
                                  </a>
                                </span>
                              </div>
                            </Typography>
                          </CardContent>

                          <hr />
                          <CardActions>
                            <Button
                              onClick={handleReset}
                              className={classes.button}
                            >
                              ยกเลิก
                            </Button>
                            {dataFile.qrcode === undefined ? (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNextStep2}
                                className={classes.button}
                              >
                                Signing Request
                              </Button>
                            ) : null}
                          </CardActions>
                        </Paper>
                      </div>
                    ) : null}
                  </Typography>
                  <Typography align="right" style={{ textAlign: "rignt" }}>
                    {activeStep === 1 ? (
                      openNext1 === 0 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={true}
                          className={classes.button}
                        >
                          {activeStep === steps.length ? "Finish" : "ถัดไป"}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNextStep1}
                          className={classes.button}
                        >
                          {activeStep === steps.length ? "Finish" : "ถัดไป"}
                        </Button>
                      )
                    ) : null}
                    {activeStep === 3 ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                      >
                        {activeStep === steps.length ? "Finish" : "ถัดไป"}
                      </Button>
                    ) : null}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </Paper>
      </main>
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={open}
        closeButton={false}
        maxWidth={"md"}

        // open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          ลงลายมือชื่ออิเล็กทรอนิกส์
        </DialogTitle>
        <DialogContent dividers>
          <CardContent component={"div"} className={[classes.fixWidth]}>
            <Typography
              className={[classes.title, classes.textAlignCenter]}
              color="textSecondary"
              gutterBottom
            >
              <b>กรุณา Scan QRCode: </b>
              <br />

              {timeCount === 0 ? (
                <Countdown
                  date={Date.now() + process.env.REACT_APP_TIME}
                  renderer={renderer}
                />
              ) : (
                // eslint-disable-next-line jsx-a11y/alt-text
                ""
              )}

              <br />
              {dataFile.qrcode === undefined ? (
                ""
              ) : (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img src={dataFile.qrcode} />
              )}
            </Typography>
            <br />
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              <b>Reference Number: </b>
              <Chip
                variant="outlined"
                color="primary"
                label={dataFile.refNumber}
              />
            </Typography>
            <br />

            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              <b>Request ID: </b>
              <Chip
                variant="outlined"
                color="primary"
                label={dataFile.requestId}
              />
            </Typography>
            <br />
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleReset} color="primary">
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
