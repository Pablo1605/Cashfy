import styles from './Footer.module.css'
import { AiFillGithub } from "react-icons/ai";
import { AiFillLinkedin } from "react-icons/ai";

export const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <h2><img width="150" height="50" src="CashFy-white.svg" alt="CashFy"/></h2>
      </div>
      <div>
        <AiFillGithub className={styles.reactIcon} onClick={() => window.open("https://github.com/Pablo1605", "_blank")} />
        <AiFillLinkedin className={styles.reactIcon} onClick={() => window.open("https://www.linkedin.com/in/pablo-ramirez-22203a377/", "_blank")} />
      </div>
    </div>
  )
}