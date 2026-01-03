import RegisterForm from "../components/RegisterForm"

const SignIn = () => {
  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <RegisterForm isLogin={true} />
    </div>
  )
}

export default SignIn