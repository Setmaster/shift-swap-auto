import NotLoggedInError from "@/components/NotLoggedInError/NotLoggedInError";

export default function SigninPage({searchParams} : {searchParams: {callbackUrl: string}}){
    return (
        <NotLoggedInError callbackUrl={searchParams.callbackUrl}/>
    );

}