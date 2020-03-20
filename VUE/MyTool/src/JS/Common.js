export const Common={
    methods:{
        Logout() {
            localStorage.removeItem("token");
            this.$router.push("/");
    }
    }}