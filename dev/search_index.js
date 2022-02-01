var documenterSearchIndex = {"docs":
[{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"EditURL = \"https://github.com/tmigot/StoppingTutorials.jl/blob/main/src/overfitting.jl\"","category":"page"},{"location":"pages/t001_overfitting/#Tutorial-1:-The-overfitting-problem-(handle-unrelated-stopping-criteria)","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"Tutorial 1: The overfitting problem (handle unrelated stopping criteria)","text":"","category":"section"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"(Image: ) (Image: )","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"In this tutorial, we present the use of Stopping to specify an \"unrelated\" stopping criterion. A typical example is the so-called case of \"overfitting\", where the optimization process is actually designed to approximate another problem.","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"using ADNLPModels, LinearAlgebra, NLPModels, Plots, Printf, Random, Stopping","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"In this tutorial, we will use the classical steepest descent method with an Armijo line-search.","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"import Stopping.armijo\nfunction armijo(xk, dk, fk, slope, f)\n  t = 1.0\n  fk_new = f(xk + dk)\n  while f(xk + t * dk) > fk + 1.0e-4 * t * slope\n    t /= 1.5\n    fk_new = f(xk + t * dk)\n  end\n  return t, fk_new\nend\n\nfunction steepest_descent(stp :: NLPStopping)\n\n  xk = stp.current_state.x\n  fk, gk = objgrad(stp.pb, xk)\n\n  OK = update_and_start!(stp, fx = fk, gx = gk)\n\n  @printf \"%2s %9s %7s %7s %7s\\n\" \"k\" \"fk\" \"||∇f(x)||\" \"t\" \"λ\"\n  @printf \"%2d %7.1e %7.1e\\n\" stp.meta.nb_of_stop fk norm(stp.current_state.current_score)\n  while !OK\n    dk = - gk\n    slope = dot(dk, gk)\n    t, fk = armijo(xk, dk, fk, slope, x->obj(stp.pb, x))\n    xk += t * dk\n    fk, gk = objgrad(stp.pb, xk)\n\n    OK = update_and_stop!(stp, x = xk, fx = fk, gx = gk)\n\n    @printf \"%2d %9.2e %7.1e %7.1e %7.1e\\n\" stp.meta.nb_of_stop fk norm(stp.current_state.current_score) t slope\n  end\n  return stp\nend","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"We also generate randomly some data.","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"Random.seed!(1234)\nm, n = 50, 10\nA  = rand(m, n)\nb  = A * ones(n)\nD  = vcat(A, A) + vcat(zeros(m,n), rand(m,n))\nDb = vcat(b, b)\nrperm = shuffle(1:2m)\nDr = D[rperm,:]\nDbr = Db[rperm,:]","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"We initialize two different problems evaluating respectively a training set, and a test set.","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"f(x, A, b, λ) = norm(A * x - b)^2 + λ * norm(x)^2\ntrain_pb = ADNLPModel(x -> f(x, Dr[1:m,:], Dbr[1:m], 1e-2), zeros(n))\ntest_pb = ADNLPModel(x -> f(x, Dr[m+1:2m,:], Dbr[m+1:2m], 0.0), zeros(n))","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"In this tutorial, the motivation is to use the solver on the test_pb, and track the efficiency of the computed solution on the train_pb. We specialize the stopping structure to store the objective function of both problems in the stopping_user_struct, and evaluate them in the stp.meta.user_check_func!.","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"train_check(stp, b) = begin\n  stp.stopping_user_struct[:test_obj][stp.meta.nb_of_stop+1] = obj(stp.stopping_user_struct[:test], stp.current_state.x)\n  stp.stopping_user_struct[:train_obj][stp.meta.nb_of_stop+1] = obj(stp.pb, stp.current_state.x)\nend\ntrain_obj = NaN * ones(101)\ntest_obj  = NaN * ones(101)\ntrain_stp = NLPStopping(train_pb, user_struct = Dict(:test => test_pb, :train_obj => train_obj, :test_obj => test_obj), user_check_func! = train_check, max_iter = 100)","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"We now run the steepest descent algorithm with the train_stp stopping.","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"steepest_descent(train_stp)","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"On the following plot in logarithmic scale, we can see that after a number of iterations, the progress made by the solver are no longer improving the other problem.","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"#hcat(log.(train_stp.stopping_user_struct[:train_obj]), log.(train_stp.stopping_user_struct[:test_obj]))\nplot(log.(train_stp.stopping_user_struct[:train_obj]), label=[\"train obj\"])\nplot!(log.(train_stp.stopping_user_struct[:test_obj]), label=[\"test obj\"], title=\"overfitting\")","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"(Image: )","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"To overcome this issue, one possibility is to stop the solver when the second is no longer being minimized. The only modification is to set the entry meta.stopbyuser to true.","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"train_check_opt(stp, b) = begin\n  k = stp.meta.nb_of_stop\n  stp.stopping_user_struct[:test_obj][k+1] = obj(stp.stopping_user_struct[:test], stp.current_state.x)\n  stp.stopping_user_struct[:train_obj][k+1] = obj(stp.pb, stp.current_state.x)\n  diff = k!=0 && stp.stopping_user_struct[:test_obj][k+1] - stp.stopping_user_struct[:train_obj][k+1] > 10\n  inc  = k!=0 && stp.stopping_user_struct[:test_obj][k+1] > stp.stopping_user_struct[:test_obj][k]\n  if diff && inc\n    stp.meta.stopbyuser = true\n  end\nend\ntrain_stp.meta.user_check_func! = train_check_opt\nreset!(train_stp.pb)\nreinit!(train_stp, rstate=true, x = zeros(10))\nsteepest_descent(train_stp)\n\nnb_iter = train_stp.meta.nb_of_stop\nhcat(log.(train_stp.stopping_user_struct[:train_obj][1:nb_iter+1]), log.(train_stp.stopping_user_struct[:test_obj][1:nb_iter+1]))\nplot(log.(train_stp.stopping_user_struct[:train_obj][1:nb_iter+1]), label=[\"train obj\"])\nplot!(log.(train_stp.stopping_user_struct[:test_obj][1:nb_iter+1]), label=[\"test obj\"], title=\"overfitting\")","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"(Image: )","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"","category":"page"},{"location":"pages/t001_overfitting/","page":"1 The overfitting problem (handle unrelated stopping criteria)","title":"1 The overfitting problem (handle unrelated stopping criteria)","text":"This page was generated using Literate.jl.","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"EditURL = \"https://github.com/tmigot/StoppingTutorials.jl/blob/main/src/checkpointing.jl\"","category":"page"},{"location":"pages/t002_checkpointing/#Tutorial-2:-Checkpointing","page":"2 Checkpointing","title":"Tutorial 2: Checkpointing","text":"","category":"section"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"(Image: ) (Image: )","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"In this tutorial, we present the use of Stopping to checkpointing.","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"When using an optimizer for high-scale problems, the resolution process might be extremly long. In order to analyze the progress of the algorithm or save ongoing results, an idea is to introduce checkpointing, i.e. we save the output result in the file every n-steps. Using Stopping this operation is now very simple.","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"using ADNLPModels, FileIO, JLD2, LinearAlgebra, NLPModels, Printf, Random, Stopping","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"In this tutorial, we will use the steepest descent method with a fixed stepsize.","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"function fixed_step_steepest_descent(stp :: NLPStopping; t = 1e-5)\n\n  xk = stp.current_state.x\n\n  OK = update_and_start!(stp, gx = grad(stp.pb, xk))\n\n  @printf \"%2s %7s\\n\" \"k\" \"||∇f(x)||\"\n  @printf \"%2d %7.1e\\n\" stp.meta.nb_of_stop norm(stp.current_state.current_score)\n  while !OK\n    xk -= t * stp.current_state.gx\n\n    OK = update_and_stop!(stp, x = xk, gx = grad(stp.pb, xk))\n\n    @printf \"%2d %7.1e\\n\" stp.meta.nb_of_stop norm(stp.current_state.current_score)\n  end\n  return stp\nend","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"We now generate a regularized least squares problem using ADNLPModels.jl.","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"Random.seed!(1234)\nm, n = 10_000, 10\nA  = rand(m, n)\nb  = A * ones(n)\nf(x, A, b, λ) = norm(A * x - b)^2 + λ * norm(x)^2\npb = ADNLPModel(x -> f(x, A, b, 1e-2), zeros(n))","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"The final step is now to initialize the Stopping and specify user-defined structures to store the parameter n_save set to 50 so that every 50 iterations the current stopping is saved using the package JLD2.jl.","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"save_check(stp, b) = begin\n  if stp.meta.nb_of_stop % stp.stopping_user_struct[:n_save] == 0\n    @save \"checkpoint_stopping_$(stp.meta.nb_of_stop).jld2\" stp\n  end\nend\nn_save = 50\nstp = NLPStopping(pb, user_struct = Dict(:n_save => n_save),\n                      user_check_func! = save_check, max_iter = 99)","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"Let's go","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"fixed_step_steepest_descent(stp)","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"The algorithm has now generated two files checkpoint_stopping_0.jld2 and checkpoint_stopping_50.jld2 that can be analyzed.","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"stp0 = load(\"checkpoint_stopping_0.jld2\")[\"stp\"]\nstp50 = load(\"checkpoint_stopping_50.jld2\")[\"stp\"]","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"","category":"page"},{"location":"pages/t002_checkpointing/","page":"2 Checkpointing","title":"2 Checkpointing","text":"This page was generated using Literate.jl.","category":"page"},{"location":"#Introduction","page":"Introduction","title":"Introduction","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Welcome to the tutorial pages of the Stopping.jl project.","category":"page"},{"location":"#Contents","page":"Introduction","title":"Contents","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Depth = 1","category":"page"},{"location":"#How-to-start","page":"Introduction","title":"How to start","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"There are different ways to use the tutorials:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"[Recommended] Reading the html version of the tutorials. This is the recommended way if you want rapid access to the material with no setup steps. Simply click in one of the links in the Contents section.\n[Recommended] Running the Jupyter notebooks locally. A working installation of Julia in the system is required. See instructions in the How to run the notebooks locally section. This is the recommended way to follow the tutorials if you want to run the code and inspect the generated results with Paraview.\nRunning the notebook remotely via binder. In that case, go to the desired tutorial and click the icon (Image: ). No local installation of Julia needed.\nReading a non-interactive version of the notebook via nbviewer. In that case, go to the desired tutorial and click the icon (Image: )","category":"page"},{"location":"#How-to-run-the-notebooks-locally","page":"Introduction","title":"How to run the notebooks locally","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Clone the repository","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"$ git clone https://github.com/tmigot/StoppingTutorials.git","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Move into the folder and open a Julia REPL setting the current folder as the project environment. ","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"$ cd Tutorials\n$ julia --project=.\n               _\n   _       _ _(_)_     |  Documentation: https://docs.julialang.org\n  (_)     | (_) (_)    |\n   _ _   _| |_  __ _   |  Type \"?\" for help, \"]?\" for Pkg help.\n  | | | | | | |/ _` |  |\n  | | |_| | | | (_| |  |  Version 1.1.0 (2019-01-21)\n _/ |\\__'_|_|_|\\__'_|  |  Official https://julialang.org/ release\n|__/                   |\n\njulia> \n","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Instantiate the environment. This will automatically download all required packages.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"# Type ] to enter in pkg mode\n(Tutorials) pkg> instantiate","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Build the notebooks","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"# Type Ctrl+C to get back to command mode\njulia> include(\"deps/build.jl\")","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Open the notebooks","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"julia> using IJulia\njulia> notebook(dir=pwd())","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"This will open a browser window. Navigate to the notebooks folder and open the tutorial you want. Enjoy!","category":"page"},{"location":"#How-to-pull-the-latest-version-of-the-tutorials","page":"Introduction","title":"How to pull the latest version of the tutorials","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"If you have cloned the repository a while ago, you can update to the newest version with these steps.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Go to the StoppingTutorials repo folder and git pull","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"$ git pull","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Open Julia REPL","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"$ julia --project=.\n","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"and instantiate the environment and build the notebooks again","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"# Type ] to enter in pkg mode\n(StoppingTutorials) pkg> instantiate\n\n# Type Ctrl+C to get back to command mode\njulia> include(\"deps/build.jl\")","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Done!","category":"page"}]
}
