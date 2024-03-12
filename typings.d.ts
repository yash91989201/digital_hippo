type FormInitialType<ErrorsType> = {
  status: "UNINITIALIZED";
  errors?: ErrorsType;
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

type UserSignInErrorsType = {
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

type UserSignInStatusType =
  | FormInitialType<UserSignInErrorsType>
  | FormSuccessType
  | FormFailType<UserSignInErrorsType>;

type NewVerificationStatusType =
  | FormInitialType<NewVerificationErrorsType>
  | FormSuccessType
  | FormFailType<NewVerificationErrorsType>;

type TableActionStatusType = {
  insert?: {
    status: "SUCCESS" | "FAILED";
    message: string;
  };
  update?: {
    status: "SUCCESS" | "FAILED";
    message: string;
  };
  delete?: {
    status: "SUCCESS" | "FAILED";
    message: string;
  };
};

type CreateProductInitialType = {
  status: "INITIAL";
};
type CreateProductSuccessType = {
  status: "SUCCESS";
  message: string;
  fields?: {
    productFiles?: TableActionStatusType;
    productImages?: TableActionStatusType;
  };
};
type CreateProductFailType = {
  status: "FAILED";
  message: string;
};

type CreateProductStatusType =
  | CreateProductInitialType
  | CreateProductSuccessType
  | CreateProductFailType;

type AuthCardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel?: string;
  backButtonHref?: string;
};
