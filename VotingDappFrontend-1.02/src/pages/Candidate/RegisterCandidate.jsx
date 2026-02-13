import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3Context } from "../../context/useWeb3Context.jsx";
import { uploadCandidateImage } from "../../utils/uploadCandidateImage.jsx";

const RegisterCandidate = () => {
  const token = localStorage.getItem("token");
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!token) {
      navigateTo("/");
    }
  }, [navigateTo, token]);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const nameRef = useRef(null);
  const genderRef = useRef(null);
  const partyRef = useRef(null);
  const ageRef = useRef(null);

  const handleCandidateRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const name = nameRef.current.value;
      const age = ageRef.current.value;
      const gender = Number(genderRef.current.value);
      const party = partyRef.current.value;
      if (gender !== 0 && gender !== 1) {
        throw new Error("Invalid gender value");
      }

      if (!contractInstance) {
        throw new Error("Contract instance not found!");
      }

      const imageUploadStatus = await uploadCandidateImage(file);
      if (imageUploadStatus === true) {
        await contractInstance.registerCandidate(name, party, age, gender);
        nameRef.current.value = "";
        ageRef.current.value = "";
        genderRef.current.value = "";
        partyRef.current.value = "";
        alert("Registration Successful");
        setFile(null);
      } else {
        throw new Error("Candidate Registration Failed!");
      }
    } catch (error) {
      console.error(error);
      alert("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Register Candidate
        </h1>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          Submit candidate details to register them on the blockchain. All fields are required.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-lg border border-border p-6 md:p-8">
        <form onSubmit={handleCandidateRegistration} className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="candidate-name" className="text-sm font-medium text-card-foreground">
              Full Name
            </label>
            <input
              id="candidate-name"
              type="text"
              ref={nameRef}
              required
              placeholder="Enter candidate's full name"
              className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          {/* Age */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="candidate-age" className="text-sm font-medium text-card-foreground">
              Age
            </label>
            <input
              id="candidate-age"
              type="number"
              ref={ageRef}
              required
              min="18"
              placeholder="Minimum age: 18"
              className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <span className="text-xs text-muted-foreground">Candidate must be at least 18 years old.</span>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="candidate-gender" className="text-sm font-medium text-card-foreground">
              Gender
            </label>
            <select
              id="candidate-gender"
              ref={genderRef}
              required
              defaultValue=""
              className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="" disabled>Select gender</option>
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
          </div>

          {/* Party */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="candidate-party" className="text-sm font-medium text-card-foreground">
              Political Party
            </label>
            <input
              id="candidate-party"
              type="text"
              ref={partyRef}
              required
              placeholder="Enter party affiliation"
              className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          {/* Photo Upload */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="candidate-photo" className="text-sm font-medium text-card-foreground">
              Candidate Photo
            </label>
            <div className="border-2 border-dashed border-input rounded-md p-4 text-center hover:border-ring transition-colors">
              <input
                id="candidate-photo"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-secondary-foreground file:cursor-pointer hover:file:bg-secondary/80"
              />
              {file && (
                <p className="mt-2 text-xs text-success">
                  Selected: {file.name}
                </p>
              )}
            </div>
            <span className="text-xs text-muted-foreground">Upload a clear, front-facing photo (JPG, PNG).</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Registering..." : "Register Candidate"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterCandidate;
