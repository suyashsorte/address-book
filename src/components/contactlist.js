import React, { useEffect, useState } from "react";
import axios from "axios";
import "./contactlist.css";

const ContactList = () => {
  const [arrContacts, setContacts] = useState([]);
  const [strfname, setfname] = useState("");
  const [strlname, setlname] = useState("");
  const [stremail, setemail] = useState("");
  const [arrEmail, setemails] = useState([]);
  const [IsAddEmail, setAddEmail] = useState(false);
  const [IsReload, setReload] = useState(false);
  const [strID, setID] = useState(0);
  const [isEdit, setisEdit] = useState(false);

  useEffect(() => {
    GetContacts();
  }, [IsReload]);

  const GetContacts = async () => {
    await axios
      .get("https://avb-contacts-api.herokuapp.com/contacts")
      .then((respo) => {
        setContacts(respo.data);
        setReload(false);
      });
  };

  const contolHandler = (e) => {
    if (e.target.name === "fname") {
      setfname(e.target.value);
    } else if (e.target.name === "lname") {
      setlname(e.target.value);
    } else {
      setemail(e.target.value);
    }
  };

  const wantToAddEmail = () => {
    if (IsAddEmail && stremail.length !== 0) {
      var arr = arrEmail;
      arr.push(stremail);
      setemails(arr);
      setAddEmail(false);
    } else {
      setemail("");
      setAddEmail(true);
    }
  };

  const CancelAction = () => {
    setfname("");
    setlname("");
    setemail("");
    setAddEmail(false);
    setemails([]);
    setisEdit(false);
    setID(0);
  };

  const SaveNewContact = (e) => {
    e.preventDefault();
    if (!isEdit) {
      if (IsAddEmail && stremail.length !== 0) {
        var arr = arrEmail;
        arr.push(stremail);
        setemails(arr);
        setAddEmail(false);
      }

      var obj = {
        firstName: strfname,
        lastName: strlname,
        emails: arrEmail,
      };

      axios
        .post("https://avb-contacts-api.herokuapp.com/contacts", obj)
        .then((respo) => {
          setReload(true);
          CancelAction();
        });
    } else {
      if (IsAddEmail && stremail.length !== 0) {
        var arr = arrEmail;
        arr.push(stremail);
        setemails(arr);
        setAddEmail(false);
      }
      var obj = {
        id: strID,
        firstName: strfname,
        lastName: strlname,
        emails: arrEmail,
      };

      axios
        .put(`https://avb-contacts-api.herokuapp.com/contacts/${strID}`, obj)
        .then((respo) => {
          setReload(true);
          CancelAction();
        });
    }
  };

  const FillDetails = (e) => {
    setfname(e.firstName);
    setlname(e.lastName);
    setemails(e.emails);
    setID(e.id);
    setisEdit(true);
  };

  const removeContact = () => {
    if (strID != 0) {
      axios
        .delete(`https://avb-contacts-api.herokuapp.com/contacts/${strID}`)
        .then((respo) => {
          setReload(true);
          CancelAction();
        });
    }
  };

  const RemoveEmail = (em) => {
    var arr = arrEmail;
    arr = arr.filter((asd) => asd !== em);
    setemails(arr);
  };

  return (
    <div className="row">
      <div className="col-md-3 allcontact">
        <div className="list-group group">
          <h3>
            Contacts{" "}
            <a href="#" onClick={() => CancelAction()}>
              <i className="fa fa-plus-circle"></i>
            </a>
          </h3>
          <div className="contact">
            {arrContacts
              .sort(function (a, b) {
                if (a.firstName.toLowerCase() < b.firstName.toLowerCase())
                  return -1;
                if (a.firstName.toLowerCase() > b.firstName.toLowerCase())
                  return 1;
                return 0;
              })
              .map((contact) => (
                <a
                  href="#"
                  className="list-group-item"
                  key={contact.id}
                  onClick={() => FillDetails(contact)}
                >
                  {contact.firstName} {contact.lastName}
                </a>
              ))}
          </div>
        </div>
      </div>
      <div className="col-md-9" style={{ minHeight: "640px" }}>
        <form
          style={{ marginTop: "50px" }}
          onSubmit={(evt) => SaveNewContact(evt)}
        >
          <div className="row">
            <div className="col-md-6">
              <label className="name">First Name</label>
              <div>
                <input
                  type="text"
                  name="fname"
                  className="form-control"
                  value={strfname}
                  onChange={(evt) => contolHandler(evt)}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className="name">Last Name</label>
              <div>
                <input
                  type="text"
                  name="lname"
                  className="form-control"
                  value={strlname}
                  onChange={(evt) => contolHandler(evt)}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className="emailheader">Email</label>
              <div className="list-group">
                {arrEmail.map((em, i) => (
                  <div key={i} className="email">
                    {em}{" "}
                    <i
                      className="fa fa-minus-circle del"
                      style={{ cursor: "pointer" }}
                      onClick={() => RemoveEmail(em)}
                    ></i>
                    <br />
                  </div>
                ))}
                {IsAddEmail && (
                  <input
                    type="text"
                    name="email"
                    className="form-control"
                    value={stremail}
                    placeholder="Enter Email"
                    onChange={(evt) => contolHandler(evt)}
                  />
                )}
                <div>
                  <a href="#" onClick={wantToAddEmail}>
                    <i className="fa fa-plus-circle addemail"></i> add email
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div
            className="row"
            style={{ position: "absolute", bottom: "10px", width: "100%" }}
          >
            <div className="col-md-10">
              <input
                type="button"
                value="Delete"
                className="btn btn-danger"
                onClick={removeContact}
              />
            </div>
            <div className="col-md-1">
              <input
                type="button"
                value="Cancel"
                className="btn btn-default"
                onClick={CancelAction}
              />
            </div>
            <div className="col-md-1">
              <input
                type="submit"
                value={isEdit ? "Update" : "Save"}
                className="btn btn-primary"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactList;
