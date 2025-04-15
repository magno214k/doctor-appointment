import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Pagination, Select, Spinner } from "../components";
import api from "../api";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const params = { page: currentPage };
        if (department) params.department = department;

        const { data } = await api.getDoctors(params);
        setDoctors(data.doctors);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [currentPage, department]);

  const handleBookAppointment = (doctorId) => {
    navigate(`/doctors/${doctorId}/book`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Find a Doctor</h1>

      <div className="mb-6">
        <Select
          label="Filter by Department"
          options={[
            { value: "", label: "All Departments" },
            { value: "Cardiology", label: "Cardiology" },
            { value: "Dermatology", label: "Dermatology" },
            // Add other departments
          ]}
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {doctors.map((doctor) => (
              <Card key={doctor._id}>
                <img
                  src={doctor.user.photo}
                  alt={doctor.user.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">
                    Dr. {doctor.user.firstName} {doctor.user.lastName}
                  </h3>
                  <p className="text-gray-600">{doctor.department}</p>
                  <p className="mt-2">{doctor.qualification}</p>
                  <p className="text-gray-700 mt-2">
                    {doctor.experience} years experience
                  </p>
                  <p className="text-lg font-semibold mt-2">
                    Fee: ${doctor.fee}
                  </p>
                  <Button
                    onClick={() => handleBookAppointment(doctor._id)}
                    className="mt-4 w-full"
                  >
                    Book Appointment
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default DoctorList;
