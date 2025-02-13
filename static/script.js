function calcularMateriaux(sauvegarder) {
    let largura = parseFloat(document.getElementById("largura").value);
    let dimension = parseFloat(document.getElementById("dimension").value);
    let estrutura = document.getElementById("estrutura").value;
    let faces = document.getElementById("faces").value;
    let placa = document.getElementById("placa").value.split("x").map(Number);
    let metal = document.getElementById("metal").value;
    let lisse = document.getElementById("lisse").value;
    let chantier = document.getElementById("chantier").value || "Sans Nom";
    let placaFaces = document.getElementById("placa-faces").value;
    let placaOsb = document.getElementById("placa-osb").value;

    let isTeto = estrutura === "Plafond";
    let isDupla = faces === "Duas Faces"; 
    let area = largura * dimension;


    let facesField = document.getElementById("faces");
    facesField.style.display = isTeto ? "none" : "block"; 


    let plaquesNecessaires;
    if (placaFaces === "2-face") {

        let primeiraCamada = Math.ceil(largura / (placa[1] / 100));
        let segundaCamada = Math.ceil(largura / ((placa[0] - 60) / 100));
        plaquesNecessaires = (primeiraCamada + segundaCamada) * 2; 
    } else {
        plaquesNecessaires = Math.ceil(area / (placa[0] * placa[1])) * (isDupla && !isTeto ? 2 : 1); 
    }

    let espacamento = isTeto ? 40 : 60;
    let metauxNecessaires = Math.ceil(largura / (espacamento / 100));
    let lisasNecessaires = Math.ceil(largura / (lisse === "3m" ? 3 : 4)) * 2;
    let vis25 = (placaFaces === "2-face") ? 0 : plaquesNecessaires * 10;
    let vis35 = (placaFaces === "2-face") ? plaquesNecessaires * 10 : 0;

    let visPourOSB = 0;
    if (placaOsb !== "0-osb") {
        let osbArea = 2.5 * 0.6;
        let osbNecessaires = Math.ceil(area / osbArea); 
        visPourOSB = osbNecessaires * 3;
    }

    let isolantNecessaire = Math.ceil(area / (1.2 * 0.6)); 
    let joinFiller = Math.ceil(area / 15);
    let metalType = isTeto ? "Profilé de plafond PlaGyp" : `Profilé horizontal (${metal})`;
    let lisaType = isTeto ? "Profilé périphérique PlaGyp" : `Profilé vertical (${lisse})`;
    let osbNecessaires = 0;
    if (placaOsb !== "0-osb") {
        osbNecessaires = Math.ceil(area / (2.5 * 0.6)); 
    }

    let resume = `Nom du Chantier: ${chantier}
Plaques nécessaires: ${plaquesNecessaires} de ${placa[0]}x${placa[1]}m
Métaux nécessaires: ${metauxNecessaires} de ${metalType}
Lisses nécessaires: ${lisasNecessaires} de ${lisaType}
Vis: ${vis25} de 25mm et ${vis35} de 35mm
Vis pour OSB: ${visPourOSB}
Isolant nécessaire: ${isolantNecessaire} unités
Sacs de finition (JoinFiller): ${joinFiller} sacs de 5kg
Placas OSB nécessaires: ${osbNecessaires} de 250x60cm`;

    document.getElementById("resultado").innerText = resume;

    if (sauvegarder) {
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF();
        doc.setFont("helvetica");
        doc.text("Résumé des Matériaux", 10, 10);
        doc.text(resume, 10, 20);
        doc.save(`Chantier_${chantier.replace(/\s+/g, "_")}.pdf`);
    }
}