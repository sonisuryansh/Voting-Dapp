import { useRef, useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";

const RegisterVoter = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [loading, setLoading] = useState(false);
  const nameRef = useRef(null);
  const ageRef = useRef(null);
  const genderRef = useRef(null);

  const handleVoterRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const name = nameRef.current.value;
      const age = ageRef.current.value;
      const gender = genderRef.current.value;
      console.log(name, age, gender);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Register Voter
        </h1>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          Register a new voter on the blockchain. Provide accurate personal details below.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-lg border border-border p-6 md:p-8">
        <form onSubmit={handleVoterRegistration} className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="voter-name" className="text-sm font-medium text-card-foreground">
              Full Name
            </label>
            <input
              id="voter-name"
              type="text"
              ref={nameRef}
              required
              placeholder="Enter voter's full legal name"
              className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          {/* Age */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="voter-age" className="text-sm font-medium text-card-foreground">
              Age
            </label>
            <input
              id="voter-age"
              type="number"
              ref={ageRef}
              required
              min="18"
              placeholder="Minimum age: 18"
              className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <span className="text-xs text-muted-foreground">Voter must be at least 18 years of age.</span>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="voter-gender" className="text-sm font-medium text-card-foreground">
              Gender
            </label>
            <select
              id="voter-gender"
              ref={genderRef}
              required
              defaultValue=""
              className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="" disabled>Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Registering..." : "Register Voter"}
          </button>
        </form>
      </div>

      {/* Notice */}
      <div className="mt-6 bg-secondary rounded-md p-4">
        <p className="text-xs text-secondary-foreground leading-relaxed">
          <strong>Note:</strong> Voter registration is recorded on the blockchain and cannot be modified once submitted. Please verify all details before registering.
        </p>
      </div>
    </div>
  );
};

export default RegisterVoter;
