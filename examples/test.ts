import { parse } from 'browser-xml';

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<plays username="phildinius" userid="716189" total="1918" page="1" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
<play id="73492140" date="2023-07-04" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Genotype: A Mendelian Genetics Game" objecttype="thing" objectid="252752">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="72442932" date="2023-05-29" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Botanik" objecttype="thing" objectid="271529">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="72442959" date="2023-05-29" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Tiny Epic Dungeons" objecttype="thing" objectid="331787">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="72442983" date="2023-05-29" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Tiny Epic Dungeons: Deluxe Edition" objecttype="thing" objectid="334889">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgamecompilation"/>
									</subtypes>
			</item>
								</play>
	<play id="72140930" date="2023-05-20" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="The Lost Code" objecttype="thing" objectid="299702">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="71636725" date="2023-05-03" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Doomlings" objecttype="thing" objectid="324413">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="71048176" date="2023-04-15" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Revive" objecttype="thing" objectid="332772">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="71048194" date="2023-04-13" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Break the Cube" objecttype="thing" objectid="354669">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="70823994" date="2023-04-08" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Earth" objecttype="thing" objectid="350184">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="70426345" date="2023-03-25" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Marvel Dice Throne" objecttype="thing" objectid="348406">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgamecompilation"/>
										<subtype value="boardgameintegration"/>
									</subtypes>
			</item>
								</play>
	<play id="70426331" date="2023-03-25" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Revive" objecttype="thing" objectid="332772">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="69051302" date="2023-02-11" quantity="2" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Frosthaven" objecttype="thing" objectid="295770">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameintegration"/>
									</subtypes>
			</item>
								</play>
	<play id="68188292" date="2023-01-21" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Marvel United" objecttype="thing" objectid="298047">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameintegration"/>
									</subtypes>
			</item>
								</play>
	<play id="68014989" date="2023-01-16" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Trekking Through History" objecttype="thing" objectid="353288">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="67793568" date="2023-01-11" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Dead Man's Draw" objecttype="thing" objectid="149155">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="67480109" date="2023-01-01" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Dice Realms" objecttype="thing" objectid="288080">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="67167080" date="2022-12-30" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Encyclopedia" objecttype="thing" objectid="351526">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="67480106" date="2022-12-27" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Dice Realms" objecttype="thing" objectid="288080">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="66437533" date="2022-12-08" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Mindbug: First Contact" objecttype="thing" objectid="345584">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameintegration"/>
									</subtypes>
			</item>
								</play>
	<play id="66353843" date="2022-12-04" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Destinies" objecttype="thing" objectid="285192">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="66349379" date="2022-12-04" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Town 66" objecttype="thing" objectid="361212">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="66349332" date="2022-12-03" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Challengers!" objecttype="thing" objectid="359970">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameintegration"/>
									</subtypes>
			</item>
								</play>
	<play id="66349206" date="2022-12-03" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Deal with the Devil" objecttype="thing" objectid="367379">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="66349368" date="2022-12-03" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Fafnir" objecttype="thing" objectid="294233">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="66353851" date="2022-12-03" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Fantasy Realms: Deluxe Edition" objecttype="thing" objectid="363289">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgamecompilation"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="66349304" date="2022-12-03" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Fisherman" objecttype="thing" objectid="372612">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="66353832" date="2022-12-03" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Flamecraft" objecttype="thing" objectid="336986">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="66353922" date="2022-12-03" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Make the Difference" objecttype="thing" objectid="365727">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="66353814" date="2022-12-03" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Starship Captains" objecttype="thing" objectid="363369">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="66349389" date="2022-12-03" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Startups" objecttype="thing" objectid="223770">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="66349259" date="2022-12-03" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Teeter Tower" objecttype="thing" objectid="358051">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="66349318" date="2022-12-03" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Tidal Blades: Banner Festival" objecttype="thing" objectid="364994">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="66349222" date="2022-12-02" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="BANANINE" objecttype="thing" objectid="371838">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="66349249" date="2022-12-02" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="おだんごびんご (Dango Bingo)" objecttype="thing" objectid="374953">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="66253474" date="2022-12-01" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Clank!: Catacombs" objecttype="thing" objectid="365717">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="65957008" date="2022-11-19" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Splendor Duel" objecttype="thing" objectid="364073">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="65956993" date="2022-11-18" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Monolyth" objecttype="thing" objectid="373759">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63247767" date="2022-08-14" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="The Isle of Cats: Explore &amp; Draw" objecttype="thing" objectid="338460">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="63141824" date="2022-08-11" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Twilight Inscription" objecttype="thing" objectid="361545">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63102924" date="2022-08-09" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Gutenberg" objecttype="thing" objectid="339958">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63082402" date="2022-08-08" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Twilight Inscription" objecttype="thing" objectid="361545">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63011333" date="2022-08-07" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Dice Hunters of Therion" objecttype="thing" objectid="362860">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63081974" date="2022-08-07" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Gartenbau" objecttype="thing" objectid="268188">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63082009" date="2022-08-07" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Kites" objecttype="thing" objectid="348096">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63082353" date="2022-08-06" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Arcana Rising" objecttype="thing" objectid="309408">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63082192" date="2022-08-06" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="The Diamond Swap" objecttype="thing" objectid="352234">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63082257" date="2022-08-05" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Cat in the Box: Deluxe Edition" objecttype="thing" objectid="345972">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="63247758" date="2022-08-05" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Gasha" objecttype="thing" objectid="340899">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63081995" date="2022-08-05" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Planted: A Game of Nature &amp; Nurture" objecttype="thing" objectid="365104">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63081988" date="2022-08-05" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Rear Window" objecttype="thing" objectid="358816">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="62983143" date="2022-08-05" quantity="5" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Turing Machine" objecttype="thing" objectid="356123">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="62983125" date="2022-08-05" quantity="2" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Twilight Inscription" objecttype="thing" objectid="361545">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63082038" date="2022-08-05" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Venn" objecttype="thing" objectid="360175">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63082333" date="2022-08-04" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Air, Land, &amp; Sea: Spies, Lies, &amp; Supplies" objecttype="thing" objectid="358981">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameintegration"/>
									</subtypes>
			</item>
								</play>
	<play id="63082314" date="2022-08-04" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Animals in Espionage" objecttype="thing" objectid="303812">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63082025" date="2022-08-04" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Fauna" objecttype="thing" objectid="35497">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameintegration"/>
									</subtypes>
			</item>
								</play>
	<play id="63010583" date="2022-08-04" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Sagrada" objecttype="thing" objectid="199561">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63082031" date="2022-08-04" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Skate Summer" objecttype="thing" objectid="353815">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63082344" date="2022-07-16" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Long Shot: The Dice Game" objecttype="thing" objectid="295374">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
										<subtype value="boardgameintegration"/>
									</subtypes>
			</item>
								</play>
	<play id="63247777" date="2022-07-02" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="ScandalOh!" objecttype="thing" objectid="319078">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="63082733" date="2022-06-21" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Dead Reckoning" objecttype="thing" objectid="276182">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63082341" date="2022-06-16" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Long Shot: The Dice Game" objecttype="thing" objectid="295374">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
										<subtype value="boardgameintegration"/>
									</subtypes>
			</item>
								</play>
	<play id="63247772" date="2022-06-11" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="ScandalOh!" objecttype="thing" objectid="319078">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="61311639" date="2022-06-06" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Hail Hydra" objecttype="thing" objectid="256877">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="60781449" date="2022-04-27" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="The Red Cathedral" objecttype="thing" objectid="227224">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="60264872" date="2022-04-26" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Cryptid: Urban Legends" objecttype="thing" objectid="343274">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="63082868" date="2022-04-11" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Hadrian's Wall" objecttype="thing" objectid="304783">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="61719690" date="2022-03-15" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Museum: Pictura" objecttype="thing" objectid="301019">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="58675897" date="2022-02-25" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Karuba" objecttype="thing" objectid="183251">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="58675904" date="2022-02-25" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Star Wars: Jabba's Palace – A Love Letter Game" objecttype="thing" objectid="353470">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="58621848" date="2022-02-22" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Five Tribes" objecttype="thing" objectid="157354">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="61311624" date="2022-02-16" quantity="8" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Welcome to the Moon" objecttype="thing" objectid="339789">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="58385645" date="2022-02-15" quantity="10" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Lovecraft Letter" objecttype="thing" objectid="198740">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="61311612" date="2022-02-08" quantity="8" length="0" incomplete="0" nowinstats="0" location="">
			<item name="My City" objecttype="thing" objectid="295486">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="58138533" date="2022-02-06" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Ark Nova" objecttype="thing" objectid="342942">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="58138453" date="2022-02-06" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Bitoku" objecttype="thing" objectid="323612">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="58138435" date="2022-02-06" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Viscounts of the West Kingdom" objecttype="thing" objectid="296151">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="57946850" date="2022-01-30" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Meadow" objecttype="thing" objectid="314491">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameintegration"/>
									</subtypes>
			</item>
								</play>
	<play id="57892850" date="2022-01-29" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Glow" objecttype="thing" objectid="275044">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="57762616" date="2022-01-25" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="It's a Wonderful Kingdom" objecttype="thing" objectid="327711">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="60782984" date="2021-12-15" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Merchants of the Dark Road" objecttype="thing" objectid="300217">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="56340192" date="2021-12-12" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="四畳半ペーパー賽系 (Four-and-a-Half Tatami Mat Galaxy)" objecttype="thing" objectid="296157">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="56313143" date="2021-12-12" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Geometric Art" objecttype="thing" objectid="286215">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="56313177" date="2021-12-12" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="In Vino Morte" objecttype="thing" objectid="212404">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="56313126" date="2021-12-12" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="It's a Wonderful Kingdom" objecttype="thing" objectid="327711">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="56313151" date="2021-12-12" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Obsession" objecttype="thing" objectid="231733">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="56313192" date="2021-12-12" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Radlands" objecttype="thing" objectid="329082">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="56313138" date="2021-12-12" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Ubongo 3D" objecttype="thing" objectid="46396">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="56340204" date="2021-12-11" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Wild Space" objecttype="thing" objectid="298371">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="56275325" date="2021-12-10" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Bites" objecttype="thing" objectid="277927">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="56355220" date="2021-12-10" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Fugitive" objecttype="thing" objectid="197443">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="56275384" date="2021-12-10" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="MAST BUY" objecttype="thing" objectid="325564">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="56275349" date="2021-12-10" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Scape Goat" objecttype="thing" objectid="315043">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="56275421" date="2021-12-10" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="YOMEN" objecttype="thing" objectid="320781">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="56269781" date="2021-12-10" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="ラムラムパーティー (Lum Lum Party)" objecttype="thing" objectid="335733">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="56217862" date="2021-12-08" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="7 Wonders: Architects" objecttype="thing" objectid="346703">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="56217857" date="2021-12-08" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Fort" objecttype="thing" objectid="296912">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameimplementation"/>
									</subtypes>
			</item>
								</play>
	<play id="56217850" date="2021-12-08" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="Rolling Realms" objecttype="thing" objectid="305682">
				<subtypes>
										<subtype value="boardgame"/>
										<subtype value="boardgameintegration"/>
									</subtypes>
			</item>
								</play>
	<play id="56183209" date="2021-12-06" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="That Time You Killed Me" objecttype="thing" objectid="344258">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	<play id="56183208" date="2021-12-05" quantity="1" length="0" incomplete="0" nowinstats="0" location="">
			<item name="That Time You Killed Me" objecttype="thing" objectid="344258">
				<subtypes>
										<subtype value="boardgame"/>
									</subtypes>
			</item>
								</play>
	</plays>`;

const json = parse(xml);

console.log(JSON.stringify(json, null, 2));