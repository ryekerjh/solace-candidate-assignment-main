"use client";

import { useEffect, useState } from "react";
import { Advocate } from "./api/types";

// Utility to format US phone numbers as (XXX) XXX-XXXX
function formatPhoneNumber(phone: string | number) {
  const digits = phone.toString().replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  return phone;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setLoading(false);
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
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-2xl sm:text-4xl font-bold text-emerald-800 mb-4 sm:mb-8 drop-shadow text-center">Solace Advocates</h1>
      <div className="w-full max-w-full sm:max-w-3xl bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-8 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              id="search"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition text-sm"
              placeholder="Search by name, city, degree, specialty, etc."
              onChange={onChange}
            />
          </div>
          <button
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 sm:px-5 py-2 rounded-md shadow transition self-end sm:self-auto text-sm"
            onClick={onClick}
          >
            Reset Search
          </button>
        </div>
        <p className="text-xs sm:text-sm text-gray-500">Searching for: <span id="search-term" className="font-semibold text-emerald-700"></span></p>
      </div>
      <div className="w-full max-w-full sm:max-w-5xl overflow-x-auto">
        <table className="min-w-full w-full bg-white rounded-xl shadow-md overflow-hidden text-xs sm:text-sm">
          <thead className="bg-emerald-100">
            <tr>
              <th className="px-1 sm:px-2 py-2 sm:py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">First Name</th>
              <th className="px-1 sm:px-2 py-2 sm:py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">Last Name</th>
              <th className="px-1 sm:px-2 py-2 sm:py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">City</th>
              <th className="px-1 sm:px-2 py-2 sm:py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">Degree</th>
              <th className="px-1 sm:px-2 py-2 sm:py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">Specialties</th>
              <th className="px-1 sm:px-2 py-2 sm:py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">Years of Experience</th>
              <th className="w-32 sm:w-40 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {loading && (<tr><td  colSpan={7} className="text-center py-8 text-lg text-gray-400 font-semibold bg-gray-50">Loading...</td></tr>)}
            {!loading && filteredAdvocates?.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-lg text-gray-400 font-semibold bg-gray-50">
                  No Advocates match that search criteria.
                </td>
              </tr>
            )}
            {filteredAdvocates?.map((advocate) => {
              return (
                <tr key={advocate.phoneNumber} className="hover:bg-emerald-50 transition">
                  <td className="px-1 sm:px-2 border-b border-gray-100">{advocate.firstName}</td>
                  <td className="px-1 sm:px-2 border-b border-gray-100">{advocate.lastName}</td>
                  <td className="px-1 sm:px-2 border-b border-gray-100">{advocate.city}</td>
                  <td className="px-1 sm:px-2 border-b border-gray-100">{advocate.degree}</td>
                  <td className="px-1 sm:px-2 border-b border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {advocate.specialties.map((s, idx) => (
                        <span key={idx} className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full border border-emerald-200">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-1 sm:px-2 border-b border-gray-100">{advocate.yearsOfExperience}</td>
                  <td className="w-32 sm:w-40 px-2 sm:px-4 border-b border-gray-100">{formatPhoneNumber(advocate.phoneNumber)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
