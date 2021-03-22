/*
 * trainSpotter
 * Copyright (C) 2021 bart
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const fs = require("fs");
const xmlParser = require("xml2json");
const formatXml = require("xml-formatter");
const moment = require("moment");

fs.readFile("src/sitemap.xml", function (err, data) {
	if (err) {
		console.log(err);
		throw Error;
	}
	const xmlObj = xmlParser.toJson(data, { reversible: true, object: true });
	const urlArray = xmlObj["urlset"]["url"];
	console.log(urlArray);
	console.log(new Date().toDateString());
	console.log(moment().format());

	for (let i = 0; i < urlArray.length; i++) {
		console.log(urlArray[i]["lastmod"]["$t"]);
		urlArray[i]["lastmod"]["$t"] = moment().format();
		console.log(urlArray[i]["lastmod"]);
	}

	const stringifiedXmlObj = JSON.stringify(xmlObj);
	const finalXml = xmlParser.toXml(stringifiedXmlObj);
	console.log(finalXml);
	fs.writeFile("src/sitemap.xml", formatXml(finalXml, { collapseContent: true }), function (err, result) {
		if (err) {
			console.log("err");
			throw Error;
		} else {
			console.log("Xml file successfully updated.");
		}
	});
});
