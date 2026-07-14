import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import api from "../../services/api.js";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories").then((response) => setCategories(response.data));
  }, []);

  return (
    <section>
      <PageHeader title="Categories" description="Master categories are managed by admins and used across all user transactions." />
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "type", label: "Type" }
        ]}
        rows={categories}
      />
    </section>
  );
}
