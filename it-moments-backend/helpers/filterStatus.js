const filterStatus = (query) => {
    const filterStatus = [
        { name: "Tất cả", status: "", class: "" },
        { name: "Hoạt động", status: "active", class: "" },
        { name: "Dừng hoạt động", status: "inactive", class: "" },
    ];

    const index = filterStatus.findIndex(item => item.status === (query.status || ""));
    if (index !== -1) {
        filterStatus[index].class = "active";
    }

    return filterStatus;
};

export default filterStatus; // Sử dụng cú pháp export default
