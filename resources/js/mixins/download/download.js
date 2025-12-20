export default {
    methods: {
        async download_ticket_attachment(id, file) {
            let path = "/trader/ticket/file?attachment_id=" + id;
            axios({
                url: path,
                method: "GET",
                responseType: "blob", // important
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", file.replace(/^.*[\\/]/, ''));
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
        },
    }
};