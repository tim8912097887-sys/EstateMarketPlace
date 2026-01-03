import RegisterForm from "../components/RegisterForm"

const SignUp = () => {


  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-center font-semibold text-3xl my-7">Sign Up</h1>
      <RegisterForm isLogin={false} />
    </div>
  )
}

export default SignUp