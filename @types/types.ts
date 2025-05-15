export type SignupResponse = {
  signup: {
    id: string;
    name: string;
    role: "student" | "admin";
    universityId: string;
    username: string;
  };
};

export type LoginResponse = {
  login: {
    token: string;
    role: "student" | "admin";
  };
};
