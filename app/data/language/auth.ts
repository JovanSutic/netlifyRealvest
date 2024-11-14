export const authMap: Record<string, Record<string, string>> = {
  en: {
    home: "Home",
    signTitle: "Sign in",
    signDescription: "Please enter your credentials to sign in.",
    googleSign: "Sign up with Google",
    googleLogin: "Continue with Google",
    magicLink: "Magic link",
    password: "Password",
    emailInput: "Enter email",
    passInput: "Enter password",
    passConfirmInput: "Confirm password",
    nameInput: "Enter name",
    passForgot: "Forgot Password?",
    sendLink: "Send magic link",
    noAccount: "Don't have an account?",
    yesAccount: "Already have an account?",
    register: "Register here",
    registerTitle: "Open free account",
    registerDescription:
      "We are happy that you want to join us. Please fill in the form below to open your account.",
    passDescription:
      "Please enter your email address and we will send you a link to reset your password.",
    linkBtn: "Send link",
    backTo: "Go back? ",
    passwordLength: "Password must have at least 8 characters.",
    passwordSpecial: "Password must have at least 1 special character.",
    passwordLowercase: "Password must have at least 1 lowercase letter.",
    passwordUppercase: "Password must have at least 1 uppercase letter.",
    passwordDigit: "Password must have at least 1 digit.",
    authApiError: "There is no account with this email and password. Please check the inputted data.",
    authApiErrorGmail: "There is no account with this email and password. Please check the inputted data or use Google login.",
    emailError: "Please provide valid email.",
    nameError: "Name must have at least 3 characters.",
    registrationApiExistingError: "The user with this email already exists. Please sign in.",
    registrationApiError: "Error occurred. Please check inputted form data and try again.",
    registrationCaptchaError: "Recaptcha error. This action is scored low on security. Please try again later.",
    accept: "I accept",
    terms: "Terms and Conditions",
    success: "Registration success",
    successText: "You have successfully signed up, now you need to confirm your email. We have sent you an email with the confirmation link. Please, check your inbox and confirm your email.",
    alreadyConfirm: "Email already confirmed?",
    errorTitle: "Error",
    confirmError: "Passwords are not identical. Please both input fields should contain the same password.",
    changePass: "Change password",
    changePassText: "Please input new password and confirm it, so that passwords from the both fields are identical.",
    recoverySend: "You have successfully started the password change process. We have send you a link for the password change, so please check your inbox and click on the link we have sent.",
    recoveryErrorText: "You are using invalid password change link. Please check you inbox for newer emails with active link. If you don't find it, start the password change process again.",
    noActiveRecoveryLink: "You do not have active password change link?",
    forgotPassAgain: "Start the process again",
    successTitle: "Success!",
    recoverySuccess: "You have changed the password. Now you can login using that new password.",
    passwordMetaTitle: 'Realvest - password change',
    passwordMetaDesc: 'Change your Realvest password',
    successMetaTitle: 'Realvest - auth action success',
    successMetaDesc: 'Authentication action success',
    registerMetaTitle: 'Realvest - create account',
    registerMetaDesc: 'Register to use Realvest, real estate analytics platform Serbia',
    loginMetaTitle: 'Realvest - login',
    loginMetaDesc: 'Login to Realvest, real estate analytics platform Serbia',
    forgetMetaTitle: 'Realvest - forgoten password',
    forgetMetaDesc: 'Start the proces for the password change',
    back: 'Go back',
  },
  sr: {
    home: "Početna",
    signTitle: "Prijavite se",
    signDescription: "Molimo vas upišite vaše podatke za prijavu.",
    googleSign: "Google registracija",
    googleLogin: "Google prijava",
    magicLink: "Magični link",
    password: "Lozinka",
    emailInput: "Upišite email",
    passInput: "Upišite lozinku",
    passConfirmInput: "Potvrdite lozinku",
    nameInput: "Upišite ime",
    passForgot: "Zaboravili ste lozinku?",
    sendLink: "Pošaljite magični link",
    noAccount: "Nemate nalog?",
    yesAccount: "Već imate nalog?",
    register: "Registrujte se",
    registerTitle: "Otvorite nalog",
    registerDescription:
      "Drago nam je da želite da nam se priključite. Molimo vas popunite formular i otvorite vaš nalog.",
    passDescription:
      "Molimo vas upišite email i poslaćemo vam link za resetovanje lozinke.",
    linkBtn: "Pošaljite link",
    backTo: "Nazad? ",
    passwordLength: "Lozinka mora imati najmanje 8 karaktera.",
    passwordSpecial: "Lozinka mora imati najmanje 1 specijalni karakter.",
    passwordLowercase: "Lozinka mora imati najmanje 1 malo slovo.",
    passwordUppercase: "Lozinka mora imati najmanje 1 veliko slovo.",
    passwordDigit: "Lozinka mora imati najmanje 1 broj.",
    authApiError: "Ne postoji nalog sa ovim emailom i lozinkom. Molimo vas proverite upisane podatke.",
    authApiErrorGmail: "Ne postoji nalog sa ovim emailom i lozinkom. Molimo vas proverite upisane podatke ili probajte Google prijavu.",
    emailError: "Molim vas upišite validan email.",
    nameError: "Ime mora imati najmanje 3 slova.",
    registrationApiExistingError: "Korisnik sa ovim email već postoji. Molim vas da se prijavite.",
    registrationApiError: "Došlo je do greške. Molimo vas proverite upisane podatke i pokušajte ponovo.",
    registrationCaptchaError: "Recaptcha greška. Radnja niskog skora verodostojnosti. Molimo vas pokušajte kasnije.",
    accept: "Prihvatam",
    terms: "Uslove korišćenja",
    success: "Uspešna registracija",
    successText: "Uspešno ste se registrovali, sada je potrebno da potvrdite vaš email kako bi mogli da pristupate platformi. Na vašu email adresu je poslat konfirmacioni email sa linkom. Molimo vas, proverite vaše sanduče i potvrdite email klikom na link.",
    alreadyConfirm: "Već ste potvrdili email?",
    errorTitle: "Greška",
    confirmError: "Lozinke nisu identične. Molimo vas u oba polja upišite istu lozinku.",
    changePass: "Promenite lozinku",
    changePassText: "Molimo vas upišite novu lozinku i potvrdite je, tako da lozinke u oba polja budu identične.",
    recoverySend: "Uspešno ste započeli proces zamene lozinke. Na vaš email je poslat link za zamenu lozinke. Molimo vas proverite vaše email sanduče i kliknite na link koji smo vam poslali.",
    recoveryErrorText: "Koristite link za promenu lozinke koji više nije aktivan. Molimo vas da u vašem email sandučetu proverite da li imate noviji email sa aktivnim linkom za promenu lozinke. Ukoliko nemate ponovo započnite proces zamene lozinke.",
    noActiveRecoveryLink: "Nemate link za promenu lozinke?",
    forgotPassAgain: "Ponovite proces zamene lozinke",
    successTitle: "Uspešno!",
    recoverySuccess: "Promenili ste lozinku, sada možete da se prijavite koristeći novu lozinku.",
    passwordMetaTitle: 'Realvest - promena lozinke',
    passwordMetaDesc: 'Promenite vašu Realvest lozinku',
    successMetaTitle: 'Realvest - uspešna auth aktivnost',
    successMetaDesc: 'Uspešna aktivnost autentikacije',
    registerMetaTitle: 'Realvest - napravite nalog',
    registerMetaDesc: 'Registrujete se na Realvest, platformu za analizu tržišta nekretnina Srbije',
    loginMetaTitle: 'Realvest - prijava',
    loginMetaDesc: 'Prijavite se na Realvest, platformu za analizu tržišta nekretnina Srbije',
    forgetMetaTitle: 'Realvest - zaboravljena lozinka',
    forgetMetaDesc: 'Započnite proces promene lozinke',
    back: 'Nazad',
  },
};

