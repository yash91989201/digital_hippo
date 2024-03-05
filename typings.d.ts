type FormInitialType<ErrorsType> = {
  status: "UNINITIALIZED";
  errors: ErrorsType;
  message: string;
};

type FormSuccessType = {
  status: "SUCCESS";
  message: string;
};

type FormFailType<ErrorsType> = {
  status: "FAILED";
  errors?: ErrorsType;
  message: string;
};

type UserLogInErrorsType = {
  email?: string;
  password?: string;
};

type UserSignUpErrorsType = {
  name?: string;
  email?: string;
  password?: string;
};

type NewVerificationErrorsType = {
  token: string;
};

type UserSignUpStatusType =
  | FormInitialType<UserSignUpErrorsType>
  | FormSuccessType
  | FormFailType<UserSignUpErrorsType>;

type UserLogInStatusType =
  | FormInitialType<UserLogInErrorsType>
  | FormSuccessType
  | FormFailType<UserLogInErrorsType>;

type NewVerificationStatusType =
  | FormInitialType<NewVerificationErrorsType>
  | FormSuccessType
  | FormFailType<NewVerificationErrorsType>;

type AuthCardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel?: string;
  backButtonHref?: string;
};

type UserSessionType =
  | {
      user: Omit<UserType, "password">;
      session: Session;
    }
  | {
      user: null;
      session: null;
    };
