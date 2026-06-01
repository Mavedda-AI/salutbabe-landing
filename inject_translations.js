const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'src/locales');

const authTr = {
  "promo_title": "Anneden anneye, güvenle.",
  "promo_subtitle": "Sıfır Komisyon Avantajı",
  "promo_desc": "Bebeğinizin küçülenlerini değerlendirin, ihtiyacınız olanlara ulaşın.",
  "secure_shopping": "Güvenli Alışveriş",
  "discover": "Keşfet",
  "welcome_back": "Tekrar Hoş Geldiniz",
  "signin_desc": "Yolculuğunuza devam etmek için giriş yapın",
  "email_toggle": "E-Posta",
  "phone_toggle": "Telefon",
  "email": "E-Posta",
  "email_placeholder": "E-posta adresinizi girin",
  "password": "Şifre",
  "password_placeholder": "Şifrenizi girin",
  "remember_me": "Beni Hatırla",
  "forgot_password": "Şifremi Unuttum?",
  "signing_in": "Giriş yapılıyor...",
  "signin_btn": "Giriş Yap",
  "google_signin": "Google ile devam et",
  "no_account": "Hesabınız yok mu?",
  "create_one": "Hesap Oluştur",
  "create_account": "Hesap Oluştur",
  "signup_desc": "Yolculuğunuza devam etmek için aramıza katılın.",
  "first_name": "Ad",
  "first_name_placeholder": "Adınızı girin",
  "last_name": "Soyad",
  "last_name_placeholder": "Soyadınızı girin",
  "password_min": "En az 8 karakter",
  "creating_account": "Hesap oluşturuluyor...",
  "coming_soon": "Yakında eklenecek!"
};

const authEn = {
  "promo_title": "From mother to mother, safely.",
  "promo_subtitle": "Zero Commission Advantage",
  "promo_desc": "Evaluate your baby's outgrown items, reach what you need.",
  "secure_shopping": "Secure Shopping",
  "discover": "Discover",
  "welcome_back": "Welcome Back to",
  "signin_desc": "Sign in to continue your journey",
  "email_toggle": "Email",
  "phone_toggle": "Phone",
  "email": "Email",
  "email_placeholder": "Enter your email",
  "password": "Password",
  "password_placeholder": "Enter your password",
  "remember_me": "Remember Me",
  "forgot_password": "Forgot Password?",
  "signing_in": "Signing In...",
  "signin_btn": "Sign In",
  "google_signin": "Continue with Google",
  "no_account": "Don't Have an Account?",
  "create_one": "Create One",
  "create_account": "Create Account",
  "signup_desc": "Join us to continue your journey.",
  "first_name": "First Name",
  "first_name_placeholder": "Enter first name",
  "last_name": "Last Name",
  "last_name_placeholder": "Enter last name",
  "password_min": "Min 8 characters",
  "creating_account": "Creating Account...",
  "coming_soon": "Coming soon!"
};

const authDe = {
  "promo_title": "Von Mutter zu Mutter, sicher.",
  "promo_subtitle": "Null-Provision-Vorteil",
  "promo_desc": "Verwerten Sie die zu klein gewordenen Sachen Ihres Babys, finden Sie, was Sie brauchen.",
  "secure_shopping": "Sicher Einkaufen",
  "discover": "Entdecken",
  "welcome_back": "Willkommen zurück bei",
  "signin_desc": "Melden Sie sich an, um fortzufahren",
  "email_toggle": "E-Mail",
  "phone_toggle": "Telefon",
  "email": "E-Mail",
  "email_placeholder": "Geben Sie Ihre E-Mail ein",
  "password": "Passwort",
  "password_placeholder": "Geben Sie Ihr Passwort ein",
  "remember_me": "Angemeldet bleiben",
  "forgot_password": "Passwort vergessen?",
  "signing_in": "Anmeldung läuft...",
  "signin_btn": "Anmelden",
  "google_signin": "Weiter mit Google",
  "no_account": "Sie haben noch kein Konto?",
  "create_one": "Konto erstellen",
  "create_account": "Konto erstellen",
  "signup_desc": "Treten Sie uns bei, um fortzufahren.",
  "first_name": "Vorname",
  "first_name_placeholder": "Vorname eingeben",
  "last_name": "Nachname",
  "last_name_placeholder": "Nachname eingeben",
  "password_min": "Mindestens 8 Zeichen",
  "creating_account": "Konto wird erstellt...",
  "coming_soon": "Demnächst!"
};

const inject = (file, obj) => {
  const p = path.join(localesPath, file);
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (!data.auth) data.auth = {};
    Object.assign(data.auth, obj);
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${file}`);
  }
};

inject('tr.json', authTr);
inject('en.json', authEn);
inject('de.json', authDe);
