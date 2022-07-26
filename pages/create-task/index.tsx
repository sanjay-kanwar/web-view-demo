import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";

const CreateTask: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Create Task</h1>
        <form action="/save-task" method="post">
          <label htmlFor="first">First name:</label>
          <input type="text" id="first" name="first" />
          <label htmlFor="last">Last name:</label>
          <input type="text" id="last" name="last" />
          <button type="submit">Submit</button>
        </form>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
};

export default CreateTask;
