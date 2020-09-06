import React from "react";
import { Divider } from "semantic-ui-react";
const quotes = [
	[
		"Cultural confinement takes place when a curator imposes his own limits on an art exhibition, rather than asking an artist to set his limits. ",
		"Robert Smithson",
	],
	[
		"A life accumulates a collection: of people, work and perplexities. We are all our own curators.",
		"Richard Fortey",
	],
	[
		"A curator is an information chemist. He or she mixes atoms together in a way to build an info-molecule. Then adds value to that molecule.",
		"Robert Scoble",
	],
	[
		"When you see something special, something inspired, you realise the debt we owe great curators and their unforgettable shows - literally unforgettable because you remember every picture, every wall and every juxtaposition.",
		"Charles Saatchi",
	],
	[
		"I was at the Smithsonian for twenty years, and I'm still at the Smithsonian as a curator emeritus, and I still plan to figure out what that means for me at this point in my life. ",
		"Bernice Johnson Reagon",
	],
	[
		"As we become curators of our own contentment on the Simple Abundance path... we learn to savor the small with a grateful heart.",
		"Sarah Ban Breathnach",
	],
	[
		"You get to be your own curator of your own exhibits inside.",
		"Regina Spektor",
	],
	[
		"Gradually as you become curator of your own contentment, you will learn to embrace the gentle yearnings of your heart.",
		"Sarah Ban Breathnach",
	],
	[
		"With YouTube - with the Internet in general - you have information overload. The people who dont necessarily get credit are the curators.",
		"Chad Hurley",
	],
	[
		"Quality, relevant content can't be spotted by an algorithm. You can't subscribe to it. You need people - actual human beings - to create or curate it.",
		"Kristina Halvorson, Content Strategy for the Web",
	],
	[
		"A curator's job does not involve wizardry, but requires a wealth of experience and knowledge, responsibility, and a good overview of artistic developments. But if we are lucky, we curators still manage to enchant visitors with the results. - René Block",
		"Carin Kuoni, Words of Wisdom: A Curator's Vade Mecum",
	],
];

function Quote() {
	var quote = quotes[Math.floor(Math.random() * quotes.length)];
	return (
		<div className="font-serif font-thin text-xl w-full pb-8 px-2">
			<Divider />"{quote[0]}"<br />
			<p className="float-right">{quote[1]}</p>
		</div>
	);
}

export default Quote;
