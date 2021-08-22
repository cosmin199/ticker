import Head from "next/head"
import Image from "next/image"
import dynamic from "next/dynamic"

const Ticker = dynamic(() => import("../components/Ticker"), {
  ssr: false,
})
import styles from "../styles/Home.module.css"

export default function Home() {
  return (
    <div>
      <Ticker />
    </div>
  )
}
