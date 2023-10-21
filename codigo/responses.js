let awaitingObjectiveChoice = false;

function getBotResponse(input) {
    if (awaitingObjectiveChoice) {
        awaitingObjectiveChoice = false; // reset the flag
        if (input == '1') {
            window.open("https://www.tuasaude.com/receitas-para-emagrecer-com-saude/", '_blank');
            return "Redirecionando para receitas para emagrecer...";
        } else if (input == '2') {
            window.open("https://vitat.com.br/receitas-para-ganhar-massa-muscular/", '_blank');
            return "Redirecionando para receitas para ganhar massa...";
        }


    }


    switch (input) {
        case '1':
            awaitingObjectiveChoice = true;
            return "Defina o seu objetivo: <br>1 - Emagrecer <br>2 - Ganhar massa";

        case '2':
            setTimeout(() => {
                window.open("https://www.google.com/search?sca_esv=575477965&tbs=lf:1,lf_ui:9&tbm=lcl&sxsrf=AM9HkKlvaG5vW-neTOD_HDqQxjR54mOklw:1697912668412&q=restaurante+saudaveis+em+bh&rflfq=1&num=10&sa=X&ved=2ahUKEwiFh9fL4YeCAxXBIbkGHX-qCrIQjGp6BAgVEAE&biw=1920&bih=924&dpr=1#rlfi=hd:;si:;mv:[[-19.834609699999998,-43.8979114],[-19.9882785,-44.0016721]];tbs:lrf:!1m4!1u3!2m2!3m1!1e1!1m4!1u2!2m2!2m1!1e1!2m1!1e2!2m1!1e3!3sIAE,lf:1,lf_ui:9", "_blank");
            }, 2000); 
            return "Redirecionando para restaurantes saudáveis em BH...";
        case '3':
            setTimeout(() => {
                window.open("https://www.google.com/maps/search/academias+em+Belo+Horizonte,+MG/@-19.8455481,-43.9779886,14.82z?entry=ttu", "_blank");
            }, 2000); 
            return "Redirecionando para academias em BH...";
            
        case '4':
            setTimeout(() => {
                window.open("https://www.mahta.bio/blogs/mahta/habitos-saudaveis?psafe_param=1&utm_term=&utm_campaign=Go-Mahta-B2C-PerfomanceMax-Retargeting&utm_source=adwords&utm_medium=ppc&hsa_acc=2244002998&hsa_cam=18568454137&hsa_grp=&hsa_ad=&hsa_src=x&hsa_tgt=&hsa_kw=&hsa_mt=&hsa_net=adwords&hsa_ver=3&gclid=CjwKCAjw7c2pBhAZEiwA88pOFw-ddLJeCVDH7xxt9tRv3KNwajMX9hBzQZCFIl0ifMtrmcDF-djVFxoCL3cQAvD_BwE", "_blank");
            }, 2000); 
            return "Redirecionando para dicas saudáveis...";        
            case '5':
                setTimeout(() => {
                    window.open("https://www.superprof.com.br/blog/ganho-muscular-para-debutantes/", "_blank");
                }, 2000); 
                return "Redirecionando para Treinos...";

        case '6':
            closeChat();    
        return "Saindo...";
        
        default:
            return "Número inválido! Por favor, insira um número entre 1 e 5. Ou 6 para sair";
    }

}
