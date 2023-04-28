import Layout from "@/components/layout";
import Link from "next/link";
import GameList from "@/components/game-list";

export default function Home() {
    return (
        <Layout title="VideoJuegos" icon="bi-controller" selected={1}>
            <GameList />
        </Layout>
    );
}
