import { type NextPage } from "next";
import Head from "next/head";
import TypingTest from "../components/typing-test/typing-test";


const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>pigeontype</title>
        <meta name="description" content="pigeon typing test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col justify-center h-full">
        <TypingTest />
      </div>
    </>
  );
};

export default Home;
