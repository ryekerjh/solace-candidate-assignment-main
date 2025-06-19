"use client";

import { useEffect, useState } from "react";
import { Advocate } from "./api/types";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      const searchTermElement = document.getElementById("search-term");
      if (searchTermElement) {
        searchTermElement.innerHTML = searchTerm;
      }
      if (!searchTerm) {
        setFilteredAdvocates(advocates);
        return;
      }
      console.log("filtering advocates...");
      const filtered = advocates.filter((advocate) => {
        return (
          advocate.firstName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          advocate.lastName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          advocate.city?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          advocate.phoneNumber?.toString()?.includes(searchTerm.toLowerCase()) ||
          advocate.degree?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          advocate.specialties?.find(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (searchTerm !== "" && !isNaN(Number(searchTerm)) && advocate.yearsOfExperience === Number(searchTerm))
        );
      });
      setFilteredAdvocates(filtered);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, advocates]);

  const onChange = (e: { target: { value: any; }; }) => {
    setSearchTerm(e.target.value);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates?.map((advocate) => {
            return (
              <tr key={advocate.phoneNumber}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s, idx) => (
                    <div key={idx}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
