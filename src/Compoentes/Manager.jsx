import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEye,
  faEyeSlash,
  faCopy,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import "react-toastify/dist/ReactToastify.css";

function Manager() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArry, setPasswordArry] = useState([]);
  const [editId, setEditId] = useState(null); // track edit mode

  const getpassword = async () => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json();
    setPasswordArry(passwords);
  };

  useEffect(() => {
    getpassword();
  }, []);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      position: "top-right",
      autoClose: 3000,
      theme: "light",
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const savePassword = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length
    ) {
      const idToUse = editId || uuidv4();
      const passwordObj = { ...form, id: idToUse };

      const updated = [...passwordArry, passwordObj];
      setPasswordArry(updated);

      // If editing, delete old one first
      if (editId) {
        await fetch("http://localhost:3000/", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId }),
        });
      }

      // Save new/edited password
      const res = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordObj),
      });

      if (res.ok) {
        toast.success("Password Saved!", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        // Reset form and editId
        setForm({ site: "", username: "", password: "" });
        setEditId(null);
      } else {
        toast.error("Failed to save password on server.");
      }
    } else {
      toast.error("Error: Fill all fields properly!");
    }
  };

  const deletePassword = async (id) => {
    if (window.confirm("Do you really want to delete this password?")) {
      const updated = passwordArry.filter((item) => item.id !== id);
      setPasswordArry(updated);

      await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      toast.success("Password deleted!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  const editPassword = (id) => {
    const item = passwordArry.find((i) => i.id === id);
    if (!item) return;

    setForm({
      site: item.site,
      username: item.username,
      password: item.password,
    });
    setEditId(item.id);
    setPasswordArry(passwordArry.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer />
      {/* UI background and layout */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          <span className="text-green-500">&lt;</span>Secure
          <span className="text-green-500">Nest/&gt;</span>
        </h1>
        <p className="text-green-700 text-center text-base sm:text-lg mt-1 mb-6">
          Your Password Manager
        </p>

        {/* Form inputs */}
        <div className="flex flex-col gap-4 sm:gap-6 p-4 text-black items-center">
          <input
            value={form.site}
            onChange={handleChange}
            className="rounded-full border border-green-500 w-full p-3"
            type="text"
            name="site"
            placeholder="Enter Your Website URL"
          />

          <div className="flex flex-col sm:flex-row w-full gap-4">
            <div className="w-full sm:w-3/4">
              <input
                value={form.username}
                onChange={handleChange}
                className="rounded-full border border-green-500 w-full p-3"
                type="text"
                name="username"
                placeholder="Enter Username"
              />
            </div>

            <div className="relative w-full sm:w-1/4">
              <input
                value={form.password}
                onChange={handleChange}
                className="rounded-full border border-green-500 w-full p-3 pr-10"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
              />
              <span
                className="absolute right-4 top-3.5 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="flex text-white justify-center gap-2 items-center bg-green-600 hover:bg-green-500 rounded-full px-6 py-2 w-fit border border-green-900"
          >
            <FontAwesomeIcon icon={faPlus} />
            {editId ? "Update" : "Save"}
          </button>
        </div>

        {/* Table display */}
        <div className="passwords mt-8">
          <h2 className="font-bold py-4 text-xl sm:text-2xl">Your Passwords</h2>

          {passwordArry.length === 0 && <div>No Passwords to Show</div>}

          {passwordArry.length !== 0 && (
            <div className="relative w-full overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full text-xs sm:text-sm text-left text-black border-collapse mb-10">
                <thead className="text-white bg-green-800 uppercase">
                  <tr>
                    <th className="px-2 py-2">Site</th>
                    <th className="px-2 py-2">Username</th>
                    <th className="px-2 py-2">Password</th>
                    <th className="px-2 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-green-100">
                  {passwordArry.map((item, index) => (
                    <tr key={index} className="border-t border-white">
                      <td className="px-2 py-2 break-words max-w-[120px]">
                        <a
                          href={item.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 underline break-all"
                        >
                          {item.site}
                        </a>
                        <FontAwesomeIcon
                          icon={faCopy}
                          className="ml-2 cursor-pointer"
                          onClick={() => copyText(item.site)}
                        />
                      </td>
                      <td className="px-2 py-2 break-words max-w-[120px]">
                        {item.username}
                        <FontAwesomeIcon
                          icon={faCopy}
                          className="ml-2 cursor-pointer"
                          onClick={() => copyText(item.username)}
                        />
                      </td>
                      <td className="px-2 py-2 break-words max-w-[120px]">
                        {item.password}
                        <FontAwesomeIcon
                          icon={faCopy}
                          className="ml-2 cursor-pointer"
                          onClick={() => copyText(item.password)}
                        />
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span
                          className="cursor-pointer px-1"
                          onClick={() => editPassword(item.id)}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </span>
                        <span
                          className="cursor-pointer px-1"
                          onClick={() => deletePassword(item.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Manager;



