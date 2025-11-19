declare module 'sweetalert2' {
  // Minimal ambient declaration to satisfy TypeScript when package types aren't resolved.
  // Prefer using the real types bundled with the package when available.
  const Swal: any;
  export default Swal;
}
