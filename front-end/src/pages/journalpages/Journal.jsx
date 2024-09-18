import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../../images/My-Nakama-Logo.png";
import MyAccount from "../MyAccount";
// import butterfly from "../../images/butterfly.png";
// import butterflyy from "../../images/butterflyy.png";
// import trashcan from "../../images/trash-can.svg";

const Journal = () => {
  const userId = useSelector((state) => state.user.userId);
  const [title, setTitle] = useState("");
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const backgroundGenerator = () => {
    return `linear-gradient(${Math.random() * 360}deg, hsl(${
      Math.random() * 360
    }, 70%, 80%), hsl(${Math.random() * 360}, 70%, 80%))`;
  };

  useEffect(() => {
    if (userId) {
      axios
        .get(`https://my-nakama-backend.onrender.com/api/journals/${userId}`)
        .then((response) => setEntries(response.data))
        .catch((error) => console.error(error));
    }
  }, [userId]);

  const openModal = (entry = null) => {
    if (entry) {
      setTitle(entry.title);
      setEntry(entry.content);
      setEditingIndex(entries.findIndex((e) => e.id === entry.id));
    } else {
      setTitle("");
      setEntry("");
      setEditingIndex(null);
    }
    document.getElementById("journal_modal").showModal();
  };

  const closeModal = () => {
    document.getElementById("journal_modal").close();
  };

  const handleSave = () => {
    if (title && entry) {
      if (editingIndex !== null) {
        const updatedEntry = {
          ...entries[editingIndex],
          userId,
          title,
          content: entry,
        };
        axios
          .put(
            `https://my-nakama-backend.onrender.com/api/journals/${updatedEntry.id}`,
            updatedEntry
          )
          .then((response) => {
            const updatedEntries = [...entries];
            updatedEntries[editingIndex] = response.data;
            setEntries(updatedEntries);
          })
          .catch((error) => console.error(error));
      } else {
        const newEntry = { userId, title, content: entry };
        axios
          .post("https://my-nakama-backend.onrender.com/api/journals", newEntry)
          .then((response) => setEntries([...entries, response.data[0]]))
          .catch((error) => console.error(error));
      }
      setTitle("");
      setEntry("");
      closeModal();
    }
  };

  const handleDelete = (index) => {
    const entryToDelete = entries[index];
    axios
      .delete(`https://my-nakama-backend.onrender.com/api/journals/${entryToDelete.id}`)
      .then(() => setEntries(entries.filter((_, i) => i !== index)))
      .catch((error) => console.error(error));
  };

  return (
    <div className="h-screen bg-gradient-to-r from-purple-200 via-pink-300 to-red-200 flex flex-col overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between w-full p-2  bg-gradient-to-r from-purple-200 via-pink-300 to-red-200 justify-between w-full p-2 shadow-md">
        <div className="flex items-center pl-8">
          <img src={Logo} alt="Logo" className="h-12 mr-2" />
          <h1 className="text-2xl font-playfair font-bold text-gray-800">
            My Nakama
          </h1>
        </div>
        <div className="flex items-center space-x-8 pr-16">
          <nav className="flex items-center space-x-8">
            <Link
              to="/chat"
              className="nav-link text-lg font-lora text-gray-800 hover:text-gray-900"
            >
              Chat
            </Link>
            <Link
              to="/blogs"
              className="nav-link text-lg font-lora text-gray-600 hover:text-gray-800"
            >
              Blogs
            </Link>
          </nav>
          <MyAccount />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto pt-20 scrollbar-hide">
        <div className="w-full p-4 text-center">
          <h1 className="text-3xl font-playfair font-bold italic tracking-wide mb-6 pt-10">
            Hey there,
          </h1>
          <h1 className="relative font-libre-baskerville tracking-wider italic text-2xl mb-6 pl-8">
  <span className="absolute left-60 text-7xl text-black-400">“</span><br/>
  As there are a thousand thoughts lying within a man that he does not know till 
  <br /> 
  he takes up the pen to write.
</h1>

          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 120"
              width="200"
              height="200"
              className="mx-auto black-glass-effect cursor-pointer"
              onClick={() => openModal()}
            >
              <rect
                x="10"
                y="10"
                width="80"
                height="100"
                rx="5"
                ry="5"
                fill="rgba(50, 50, 50, 0.3)"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="2"
              />
              <line
                x1="40"
                y1="60"
                x2="60"
                y2="60"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="4"
              />
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="70"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="4"
              />
            </svg>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {entries
              .filter((entry) => entry !== null && entry !== undefined)
              .map((entry) => (
                <div
                  key={entry.id}
                  // className="relative bg-white shadow-md rounded-lg flex flex-col p-4 cursor-pointer"
                  className="card bg-base-100 w-64 h-64 shadow-xl"
                  data-theme="cupcake"
                  style={{
                    // width: "160px",
                    // height: "190px",
                    background:
                      backgroundGenerator(),
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    // backdropFilter: "blur(10px) "rgba(173, 216, 230, 0.6)"",
                  }}
                  onClick={() => openModal(entry)}
                >
                  <div className="card-body">
                  {/* <h3 className="relative text-md font-libre-baskerville italic z-10"> */}
                  <h3 className="card-title text-md font-libre-baskerville italic z-10">
                    {entry.title}
                  </h3>
                  {/* <div
                    style={{
                      position: "absolute",
                      bottom: "0px",
                      right: "2px",
                    }}
                  >
                    <img src={butterfly} alt="Butterfly" />
                  </div> */}
                  {/* <div className="dropdown dropdown-left dropdown-hover absolute top-2 right-2">
                    <div tabIndex={0} role="button" className="cursor-pointer">
                      <img src={trashcan} alt="Trash Can" className="h-6 w-6" />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-white rounded-lg shadow-lg z-10 mt-2 p-2 w-40"
                    >
                      <li> */}
                      <div className="card-actions justify-end">
                        <button
                          // className="flex items-center btn justify-start w-full text-left text-red-600 hover:bg-red-100 rounded px-2 py-2"
                          className="btn btn-primary glass mt-32 p-4 italic font-libre-baskerville px-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(
                              entries.findIndex((e) => e.id === entry.id)
                            );
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                      {/* </li>
                    </ul>
                  </div> */}
                </div> 
              ))}
          </div>
        </div>
      </div>
      {/* Modal */}
      <dialog id="journal_modal" data-theme="cupcake" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-full bg-citrine-white max-w-4xl">
          <h3 className="font-bold font-libre-baskerville italic center text-lg ">
            Write Your Journal
          </h3>
          <div className="join join-vertical w-full rounded-lg-20 mt-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full join-item px-4 py-2 font-playfair text-2xl italic border-gray-300 focus:outline-none focus:border-blue-500"
            // style={{ borderRadius: "0" }}
          />
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="w-full h-64 px-4 py-6 join-item focus:outline-none font-chivo"
            placeholder="Write down your thoughts..."
          ></textarea>
          </div>
          <div className="modal-action">
            <button
              className="btn bg-warm-yellow text-warm-red"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="btn bg-warm-yellow text-warm-red"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Journal;
