import axiosInstance from "./axiosInstance";
// Export API methods
export const signupMover = async (data) => {
  try {
    const response = (await axiosInstance.post("/auth/signup/mover", data)).data;
    const token = response.data.token;

    // Store the token in localStorage (or sessionStorage)
    if (token) {
      localStorage.setItem("x-auth-token", token);
    }
    return response;
  } catch (error) {
    console.error("Error Signup mover:", error);
    throw error;
  }
};

export const signupMember = async (data) => {
  try {
    const response = (await axiosInstance.post("/auth/signup/member", data)).data;
    const token = response.data.token;

    // Store the token in localStorage (or sessionStorage)
    if (token) {
      localStorage.setItem("x-auth-token", token);
    }
    return response;
  } catch (error) {
    console.error("Error updating mover:", error);
    throw error;
  }
};

export const updateMover = async (id, formData) => {
  try {
    // Pass FormData and set content-type for form data
    formData.append("id", id);
    const response = await axiosInstance.post(`/mover/updateMover`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating mover:", error);
    throw error;
  }
};

export const updateUser = async (data) => {
  try {
    // Pass FormData and set content-type for form data
    const response = await axiosInstance.post(`/auth/updateUser`, { data });
    return response.data;
  } catch (error) {
    console.error("Error updating mover:", error);
    throw error;
  }
};


export const signinMoverWithGoogle = async (data) => {
  const response = await axiosInstance.post("/auth/signWithGoogle/mover", data);
  const token = response.data.data.token;

  // Store the token in localStorage (or sessionStorage)
  if (token) {
    localStorage.setItem("x-auth-token", token);
  }
  return response.data;
}

export const signinMover = async (data) => {
  const response = await axiosInstance.post("/auth/signin/mover", data);
  const token = response.data.data.token;

  // Store the token in localStorage (or sessionStorage)
  if (token) {
    localStorage.setItem("x-auth-token", token);
  }
  return response.data;
}

export const checkAuth = async () => {
  try {
    const response = await axiosInstance.post("/auth/checkAuth");
    return response.data;
  }
  catch (error) {
    console.log("Error=>", error)
  }
}