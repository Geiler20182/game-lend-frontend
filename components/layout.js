import Footer from "./footer";
import Header from "./header";
import Head from "next/head";

export default function Layout({ children, title, icon, selected }) {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Header selected={selected}/>
            <div className="text-center">
                <h1 className="display-1 text-dark" style={{ fontWeight: "bold" }}>
                   {title} <i className={`bi ${icon}`}></i>
                </h1>
                <hr className="hr hr-blurry" />
            </div>
            <main className="container">{children}</main>
            <Footer />
        </>
    );
}
