import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import sanityClient from "../client.js";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";

const builder = imageUrlBuilder(sanityClient);
function urlFor(source){
    return builder.image(source);
}


export default function SinglePost() {
    const[singlePost, setSinglePost] = useState(null);
    const { slug } = useParams();

    useEffect(() => {
        sanityClient.fetch(`*[slug.current == "${slug}"]{
            title,
            _id,
            slug,
            mainImage{
                asset->{
                    _id,
                    url
                }
            },
            body,
            "name": author->name,
            "authorImage": author->image
        }`).then((data) => setSinglePost(data[0]))
           .catch(console.error);
    }, [slug]);
    
    if (!singlePost) return <div>Please wait. Loading...</div>

    return (
        <main className="bg-gray-200 min-h-screen p-12">
            <article className="container shadow-lg mx-auto bg-green-100 rounded-lg">
                <header className= "relative">
                    <div className="absolute h-full w-full flex items-center justify-center p-8">
                        <div className="bg-white bg-opacity-65 rounded p-12">
                            <h1 className="cursive text-3xl lg:text-6xl mb-4">{singlePost.title}</h1>
                            <div className="flex justify-center text-gray-800">
                            <img alt={singlePost.name}
                            src={urlFor(singlePost.authorImage).url()}
                            className="w-20 h-20 rounded-full"
                            />
                            </div>
                            <p className="cursive text-2xl lg:text-2xl mb-3 text-center pt-4">
                                {singlePost.name}
                            </p>
                        </div>
                    </div>
                    <img src={singlePost.mainImage.asset.url}
                        alt={singlePost.title}
                        className="w-full object-cover rounded-t"
                        style={{height:"400px"}}
                    />
                </header>
                <div className="px-5 lg:px-48 py-5 pt-7 pb-7 lg: py-20 prose lg:prose-xl max-w-full">
                <BlockContent 
                blocks={singlePost.body} 
                projectId="v3y5b6nd"
                dataset="production"
                />
                </div>
            </article>
        </main>
    )
}