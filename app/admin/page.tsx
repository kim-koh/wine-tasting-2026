// Components
import AdminContent from "@/Components/AdminContent/AdminContent";
// CSS
import "./page.css";
import BurgerMenu from "@/Components/BurgerMenu/BurgerMenu";

export default function AdminPage() {
    return (
        <div className="admin-page">
            <BurgerMenu />
            <section className="admin-page__main">
                <h1 className="admin-page__title">Admin Page</h1>
                <p className="admin-page__subtitle">For Kim and Calvin only!</p>
                <AdminContent />
            </section>
        </div>
    )
}